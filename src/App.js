import './App.css';
import { useState } from 'react'

import CeramicClient from '@ceramicnetwork/http-client'
import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver'
import { getResolver as getKeyResolver } from 'key-did-resolver'
// import { EthereumWebAuth, getAccountId } from '@didtools/pkh-ethereum'
import { EthereumAuthProvider, SelfID } from '@self.id/web'
import { ethers } from 'ethers'

import { DIDSession } from 'did-session'
import { EthereumWebAuth, EthereumNodeAuth, getAccountId } from '@didtools/pkh-ethereum'
import { ComposeClient }from '@composedb/client'

// import { EthereumAuthProvider, ThreeIdConnect } from '@3id/connect'
import { DID } from 'dids'
import { IDX } from '@ceramicstudio/idx'
import { img } from './images/img'
import { web3Modal } from 'web3modal'
import { getLegacy3BoxProfileAsBasicProfile } from '@self.id/3box-legacy'




const endpoint = "https://localhost:7007"
// https://gateway-clay.ceramic.network
// const endpoint = "https://www.google.com.br/"
// const endpoint = "https://gateway.ceramic.network"
// const endpoint = "https://gateway-clay.ceramic.network"
// const endpoint = "https://ceramic-clay.3boxlabs.com"
// const endpoint = "https://beta.3box.io/address-server/" 



function App() {
  //create states for the data to be loaded and for the state of loadness
  const [name, setName] = useState('')
  const [image, setImage] = useState('')
  const [loaded, setLoaded] = useState(false)


  // connect with users ethereum wallet address 
  // return array of addresses. assumption we will use first address
  async function connect() {
    // console.log(" ")
    // console.log("function connect called")

// sessions
    // const addresses = await window.ethereum.request({
    //   method: 'eth_requestAccounts'
    // })
    const addresses = await window.ethereum.request({
      method: 'eth_requestAccounts',
    })
    
    // const addresses = await ethProvider.request({ method: 'eth_requestAccounts' })

    // const self = await SelfID.authenticate({
    //   authProvider: ethProvider,
    //   ceramic: 'local',
    //   connectNetwork: 'testnet-clay',
    // })
    // console.log("type of addresses " , typeof addresses);
    // console.log("connect addresses" , addresses)
    // console.log("connect addresses[0]" , addresses)
    // console.log("connect before return")

    return addresses
  }



  async function readProfile() {

    const [address] = await connect()

    const ceramic = new CeramicClient(endpoint)
    const idx = new IDX({ ceramic })

    // console.log("readProf idx " , idx)
 

      
        try {
          const data = await idx.get(
            'basicProfile',
          // `${address}@eip155:1`
           `eip155:1:${address}`    
                              
  )

      if (data.name) setName(data.name)
      if (data.avatar) setImage(data.avatar)
    } catch (error) {

      console.log('error: ', error)
      console.log("error catched")
      setLoaded(true)
    }
  }
async function updateProfile(){
  console.log(' ')
  console.log('update profile function called')

  console.log(' ')
  console.log('const ceramic = new CeramicClient(endpoint) ' )
  const ceramic = new CeramicClient(endpoint) //create ceramic instance
  
  
  const [address] = await connect() // await connection
  console.log(' ')
  console.log('address: ' , address)
 
  // console.log('const ethProvider = await web3Modal.connect()')
  // const ethProvider = await web3Modal.connect() 
  // const ethProvider = new EthereumWebAuth.connect()
  // const ethProvider = window.stargazer.getProvider("ethereum");


  // console.log(' ')
  // console.log('ethprovider')
  // const overrides = {
  //   ethUrl: 'https://eth-rpc.gateway.pokt.network.',
  // }
  // const ethUrl = overrides.ethUrl || `https://eth-rpc.gateway.pokt.network.` // Use Ganache localhost if overrides undefined
  // const ethProvider = new ethers.providers.JsonRpcProvider(ethUrl)


  console.log(' ')
  console.log('ethprovider')
  const overrides = {
    ethUrl: 'https://cloudflare-eth.com',
  }
  const ethUrl = overrides.ethUrl || `https://cloudflare-eth.com` // Use Ganache localhost if overrides undefined
  const ethProvider = new ethers.providers.JsonRpcProvider(ethUrl)

  console.log(' ')
  console.log('ethProvider: ' , ethProvider)
  console.log('typeOf ethprovider ', typeof ethProvider)
  // "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"
  // https://cloudflare-eth.com

  //  
  // console.log("")
  // console.log("ceramic " , ceramic)
  // console.log("ceramic type of " , typeof ceramic)


  // console.log(' ')
  // console.log(' const threeIdConnect = new ThreeIdConnect()')
  // const threeIdConnect = new ThreeIdConnect() //create 3id instance
  // const ethProvider = new EthereumAuthProvider(window.ethereum, address) // hier I have already verified connection with wallet
  console.log(' ')
  console.log('const accountId = await getAccountId(ethProvider, address[0])')
  // const accountId = await getAccountId(ethProvider, address)
  const accountId = await getAccountId( window.ethereum, address)

  console.log(' ')
  console.log('const authMethod = await EthereumWebAuth.getAuthMethod(ethProvider, accountId)')
  // const authMethod = await EthereumWebAuth.getAuthMethod(ethProvider, accountId)
  // const authMethod = await EthereumWebAuth.getAuthMethod( window.ethereum, accountId)
  const authMethod = await EthereumNodeAuth.getAuthMethod(window.ethereumm, accountId) //stopped
  // window.ethereum

  // console.log(' ')
  // console.log('compose client')
  // const session = await DIDSession.authorize(authMethod, { resources: []})
  // const session = await DIDSession.authorize(authMethod, { resources: [...]})
  
  // const compose = new ComposeClient()
  const client = new ComposeClient({ceramic})
  const resources = client.resources


  console.log(' ')
  console.log('await DIDSession.authorize(authMethod, ')
  const session = await DIDSession.authorize(authMethod, {resources})

  console.log(' ')
  console.log('ceramic set DID')
  ceramic.setDID(session.did)

  // ceramic.did = session.did   
  // const session = await DIDSession.authorize(authMethod, { resources: [...]})



  // console.log(' ')
  // console.log(' const provider = new EthereumAuthProvider(window.ethereum, address[0])')
  // const provider = new EthereumAuthProvider(window.ethereum, address[0])

  // console.log(' ')
  // console.log('provider ', provider)
  // wait connection with 3id

  // console.log(' ')
  // console.log(' await threeIdConnect.connect(provider) ')   

  // await threeIdConnect.connect(provider)

  // interact DID. store variable DID: either create DID or get a reference based on users address
  // console.log(' ')
  // console.log(' const did = new DID({  ... ')

  // const did = new DID({       // problem here
  //   // provider: session.getDidProvider(), 
  //   resolver: {
  //     ...ThreeIdResolver.getResolver(ceramic),
  //     ...getKeyResolver(),
  //   },
  // })

  // console.log(' ')
  // console.log("ceramic.setDID(did)")
  // create the DID 
  // ceramic.setDID(did)


  // console.log(' ')
  // console.log('after set DID')

  // authenticate user:
  // console.log(' ')
  // console.log("await ceramic.did.authenticate())") 
  // await ceramic.did.authenticate()         
  console.log(' ')
  console.log('caramic.did.authentivate')
  await ceramic.did.authenticate()              // PROBLEM HERE
  // console.log('after ceramic.did.authenticate')

  // create data schema and pass it to ceramic 
  // console.log(' ')
  // console.log('const idx = new IDX({ceramic}) ')
  console.log(' ')
  console.log('IDX')
  const idx = new IDX({ceramic})
  console.log('idx ' , idx)

  //pass the newly received data into the data schema called ix
  // console.log(' ')
  // console.log(' ]await idx.set(basicProfile, { ')
  console.log(' ')
  console.log('idx.set')
  await idx.set('basicProfile', {
    name, 
    avatar:img
    
  })
  console.log("Profile updated!")

}


  

  return (
    <div className="App">
    <input placeholder="Name" onChange={e=>setName(e.target.value)} />
    <input placeholder="Profile Image" onChange={e=>setImage(e.target.value)} />
    <button onClick={updateProfile}>Set Profile</button>
    <button onClick={readProfile}>Read Profile</button>

    {name && <h3>{name}</h3>}
    { image && <img alt="ka no complain!"style={{ width: '400px' }} src={img.eule} /> }
    {(!image && !name && loaded) && <h4>No profile, please create one</h4>}
    </div>
    // `eip155:1:${address}``
    );
}

export default App;