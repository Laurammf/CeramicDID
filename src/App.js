import './App.css';
import { useState } from 'react'

import { DIDSession } from 'did-session'
import { EthereumNodeAuth, getAccountId } from '@didtools/pkh-ethereum'
import { ComposeClient }from '@composedb/client'
import { readEncodedComposite } from '@composedb/devtools-node'
import { DID } from 'dids'
import { Ed25519Provider } from 'key-did-provider-ed25519'
import { getResolver } from 'key-did-resolver'
import { fromString } from 'uint8arrays/from-string'
import { IDX } from '@ceramicstudio/idx'
import { img } from './images/img'
import { writeEncodedComposite } from '@composedb/devtools-node'
import { Composite } from '@composedb/devtools'
import CeramicClient from '@ceramicnetwork/http-client'
import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver'
import { EthereumAuthProvider, ThreeIdConnect } from '@3id/connect'
import * as fs from 'fs'

// var fs = require('fs');

//  const endpoint = "http://localhost:7007"                   // 1 
 const endpoint = "https://gateway-clay.ceramic.network"      // 2 
// const endpoint = "http://192.168.188.58:7007/"
//  const endpoint = "https://ceramic-clay.3boxlabs.com"




function App() {
  //create states for the data to be loaded and for the state of loadness
  const [name, setName] = useState('')
  const [image, setImage] = useState('')
  const [loaded, setLoaded] = useState(false)



  async function connect() {

    const addresses = await window.ethereum.request({
      method: 'eth_requestAccounts',
    })
   

    return addresses
  }



  async function readProfile() {
    const [address] = await connect()
    const ceramic = new CeramicClient(endpoint)


    const idx = new IDX({ ceramic })
        try {
          const data = await idx.get(
           'basicProfile',
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

  // VERSION 1 with updated APIS
  console.log(' ')
  console.log('update profile function called')
  const ceramic = new CeramicClient(endpoint) //create ceramic instance
  // const client = new ComposeClient(ceramic)
  
  const [address] = await connect() // await connection  
  const accountId = await getAccountId( window.ethereum, address)

  console.log(' ')
  console.log('const authMethod = await EthereumWebAuth.getAuthMethod(ethProvider, accountId)')
  const authMethod = await EthereumNodeAuth.getAuthMethod(window.ethereum, accountId) 

  console.log('const composite:')

  const composite = await Composite.fromModels({
    ceramic: ceramic,
    // index: false,
    // models: ['kjz16hvfrbw6ca7nidsnrv78x7r4xt0xki71nvwe4j5a3s9wgou8yu3aj8cz38e'],   // a     INVALID REF
    models: ['kjzl6hvfrbw6c7keo17n66rxyo21nqqaa9lh491jz16od43nokz7ksfcvzi6bwc']       // b
    // models: ['k2t6wyfsu4pg2qvoorchoj23e8hf3eiis4w7bucllxkmlk91sjgluuag5syphl'],       // c   refer to a tile
  })
  console.log('write encoded composite ')

  // await writeEncodedComposite(composite, 'my-composite.json') PROBLEM HERE
  console.log("test type"+typeof(composite))
  
  const resources = composite.resources

  const session = await DIDSession.authorize(authMethod, {resources})

  const did = new DID({
    resolver: getResolver(),
    provider: new Ed25519Provider(), // here inside parenthesis private key
  })
  await did.authenticate()

  console.log(' ')
  console.log('ceramic.setDID')
  ceramic.setDID(session.did)
  console.log("end of the code")


  //++++++++++++ VERSION 2 WITH OBSOLETE APIS +++++++++++++
  // const ceramic = new CeramicClient(endpoint)
  // const client = new ComposeClient({ceramic})
  // const resources = client.resources
  // const [address] = await connect()
  // console.log('await DIDSession.authorize(authMethod, ')
  // const authMethod = new EthereumAuthProvider(window.ethereum, address)
  // console.log('session = await DIDSession.authorize(authMethod, {resources})')
  // const session = await DIDSession.authorize(authMethod, {resources})
  // console.log('ceramic.did = session.did')
  // ceramic.did = session.did   
  // //const session = await DIDSession.authorize(authMethod, { resources: [...]})
  // console.log('threeIdConnect = new ThreeIdConnect()')
  // const threeIdConnect = new ThreeIdConnect()
  // console.log('threeIdConnect.connect(authMethod)')
  // await threeIdConnect.connect(authMethod)
  // console.log('const did = new DID({  ')
  // const did = new DID({       // problem here
  //   // provider: session.getDidProvider(), 
  //   resolver: {
  //     ...ThreeIdResolver.getResolver(ceramic),
  //     ...getKeyResolver(),
  //   },
  // })
  // //create the DID 
  // console.log('ceramic.setDID(did) ')
  // ceramic.setDID(did)
  // //authenticate user:   
  // await ceramic.did.authenticate()              // PROBLEM HERE
  // //create data schema and pass it to ceramic 
  // const idx = new IDX({ceramic})
  // console.log('idx ' , idx)

  // //pass the newly received data into the data schema called ix

  // console.log('idx.set')
  // await idx.set('basicProfile', {
  //   name, 
  //   avatar:img
    
  // })

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