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
    
    const tx = async () => {
      //const wallet = new NodeWallet(myWallet);
      const destPK = new PublicKey(
        'GCw7dz9eQhLJ3RS98sFq99vBc9SUEm85eH5tVpfCKK3y'
      );
      const mint = new PublicKey('G527jgwh3ktGuhMMmEaWmugRzjD2stKnVGqBhh9Qy2C8');
      const destination =  destPK;


      const originAta = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        mint,
        wallet.publicKey,
      );

      console.log('originAta:', originAta)

      const send = await actions.sendToken({
        connection: connection, 
        wallet: wallet, 
        source: originAta, 
        destination:  destPK, 
        mint: mint, 
        amount: 1
      }); 

      
      console.log(send)


    };
  
  
    /*if (wallet.connected) {     
      createVault()
    }*/
    tx()
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