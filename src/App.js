import './App.css';
import BN from 'bn.js';
import { Transaction } from '@metaplex-foundation/mpl-core';
import { getPhantomWallet as PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { useWallet, WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Connection,  actions } from '@metaplex/js';
import { sendAndConfirmTransaction } from '@solana/web3.js';


require('@solana/wallet-adapter-react-ui/styles.css');

const wallets = [
  /* view list of available wallets at https://github.com/solana-labs/wallet-adapter#wallets */
  new PhantomWalletAdapter()
]

function App() {
  const wallet = useWallet();
  const adapter = wallet.adapter;
  const connection = new Connection('testnet');


  async function click() {    

    const TOKEN_AMOUNT = 2;

    const getBalance = async () => {
      console.log(adapter)
      const balance = await connection.getBalance(adapter.publicKey);
      console.log(balance)
    }
    const   createVault = async () => {
      const externalPriceAccountData = await  actions.createExternalPriceAccount({
        connection,
        wallet,
      });
      console.log(externalPriceAccountData)
      await connection.confirmTransaction(externalPriceAccountData.txId, 'finalized');

      const vault = await actions.createVault({
        connection,
        wallet,
        ...externalPriceAccountData,
      });
      console.log(vault)

      const testNfts = [];

      for (let i = 0; i < TOKEN_AMOUNT; i++) {
        const {
          mint,
          recipient: tokenAccount,
          createAssociatedTokenAccountTx,
          createMintTx,
          mintToTx,
        } = await actions.prepareTokenAccountAndMintTxs(connection, wallet.publicKey);
  
        await sendAndConfirmTransaction(
          connection,
          Transaction.fromCombined([createMintTx, createAssociatedTokenAccountTx, mintToTx]),
          [ mint, wallet.publicKey],
        );
  
        testNfts.push({
          tokenAccount,
          tokenMint: mint.publicKey,
          amount: new BN(1),
        });
      }
  

      const { safetyDepositTokenStores } = await actions.addTokensToVault({
        connection,
        wallet,
        vault,
        nfts: testNfts,
      });
      console.log(safetyDepositTokenStores)

      
  
      /*const vault = await Vault.load(connection, vaultResponse.vault);
      console.log(vault) */
    
    }
  
  
    if (wallet.connected) {
      getBalance()
      createVault()
    }
  }

  // Get wallet balance in LAMPORTS
  
  

  if (!wallet.connected) {
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