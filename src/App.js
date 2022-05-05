import './App.css';
import { getPhantomWallet as PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { useWallet, WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Connection, programs } from '@metaplex/js';
const { metadata: { Metadata } } = programs;


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

    const getBalance = async () => {
      console.log(adapter)
      const balance = await connection.getBalance(adapter.publicKey);
      console.log(balance)
    }

    const getMetadata = async () => {
      console.log(adapter.publicKey)
      const nftsmetadata = await Metadata.findDataByOwner(connection, adapter.publicKey);
      console.log(nftsmetadata);
    }
    
  
  
    if (wallet.connected) {
      getBalance() 
      getMetadata()   
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