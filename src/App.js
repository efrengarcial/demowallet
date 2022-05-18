import './App.css';
import BN from 'bn.js';
import { getPhantomWallet as PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { useWallet, WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Connection,  actions, programs, NodeWallet, transactions } from '@metaplex/js';
import { PublicKey, Keypair } from '@solana/web3.js';
import { ASSOCIATED_TOKEN_PROGRAM_ID, Token, TOKEN_PROGRAM_ID, u64 } from '@solana/spl-token';
import { Account, Transaction } from '@metaplex-foundation/mpl-core';

const { vault: { Vault } } = programs
const { CreateAssociatedTokenAccount } = transactions
const { sendTransaction } = actions


require('@solana/wallet-adapter-react-ui/styles.css');

const wallets = [
  /* view list of available wallets at https://github.com/solana-labs/wallet-adapter#wallets */
  new PhantomWalletAdapter()
]


function App() {
  const wallet = useWallet();
  console.log(wallet)
  //const adapter = wallet.adapter;
 const connection = new Connection('devnet');  

  async function click() {        
    
   
    const   createVault = async () => {
     
      const externalPriceAccountData = await  actions.createExternalPriceAccount({
        connection,
        wallet,
      });
      console.log('externalPriceAccountData:', externalPriceAccountData)
      await connection.confirmTransaction(externalPriceAccountData.txId, 'finalized');

      const { vault } = await actions.createVault({
        connection,
        wallet,
        ...externalPriceAccountData,
      });
      console.log("vault:",vault)

      const testNfts = [];
     
      const tokenAccount = new  PublicKey('GuEbjBXcBAMJHExGkxziagijc8Da9693tEKz5rRc8tRT');
      const tokenMint =  new  PublicKey('FyrcqnCoefSZuTRH9TqmRMBarzX6sDVniXdEwjwRLqCh');

      testNfts.push({
        tokenAccount,
        tokenMint: tokenMint,
        amount: new BN(1),
      });
      console.log('testNfts', testNfts)

      const vaultAuthority = await Vault.getPDA(vault);
      console.log("vaultAuthority",vaultAuthority)
  
      const { safetyDepositTokenStores } = await actions.addTokensToVault({
        connection,
        wallet,
        vault,
        nfts: testNfts,
      });
      console.log(safetyDepositTokenStores)

     };  
  
  
    /*if (wallet.connected) {     
      createVault()
    }*/
    createVault()
  }

  // Get wallet balance in LAMPORTS
  
  

  if (false) {
    /* If the user's wallet is not connected, display connect wallet button. */
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop:'100px' }}>
        <WalletMultiButton />
      </div>
    )
  } else {
    return (
      <div className="App">
        <div>          
          <button id="metadata" onClick={click} type="button">Get metadata</button>
        </div>
      </div>
    );
  }
}

/* wallet configuration as specified here: https://github.com/solana-labs/wallet-adapter#setup */
const AppWithProvider = () => (
  <ConnectionProvider endpoint="https://api.testnet.solana.com">
    <WalletProvider wallets={wallets} autoConnect>
      <WalletModalProvider>
        <App />
      </WalletModalProvider>
    </WalletProvider>
  </ConnectionProvider>
)

export default AppWithProvider;