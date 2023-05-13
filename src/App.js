import './App.css';
import { useState } from 'react'

import CeramicClient from '@ceramicnetwork/http-client'


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
import * as fs from 'fs'

// var fs = require('fs');

const endpoint = "http://localhost:7007"
// https://gateway-clay.ceramic.network
// const endpoint = "https://www.google.com.br/"
// const endpoint = "https://gateway.ceramic.network"
// const endpoint = "https://gateway-clay.ceramic.network"
 //const endpoint = "https://ceramic-clay.3boxlabs.com"
// const endpoint = "https://beta.3box.io/address-server/" 



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
  console.log(' ')
  console.log('update profile function called')
  const ceramic = new CeramicClient(endpoint) //create ceramic instance

  
  const [address] = await connect() // await connection  

 
  const accountId = await getAccountId( window.ethereum, address)

  console.log(' ')
  console.log('const authMethod = await EthereumWebAuth.getAuthMethod(ethProvider, accountId)')
  const authMethod = await EthereumNodeAuth.getAuthMethod(window.ethereumm, accountId) 
  

  console.log('const composite:')

  const composite = await Composite.fromModels({
    ceramic,
    models: ['kjzl6hvfrbw6c7keo17n66rxyo21nqqaa9lh491jz16od43nokz7ksfcvzi6bwc'],
  })
  console.log('write encoded composite composite:')

//  await writeEncodedComposite(composite, 'my-composite.json')
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


  //++++++++++++OLD VERSION WITH IDX - please ignore+++++++++++++
  // const client = new ComposeClient({ceramic})
  // const resources = client.resources
  // console.log('await DIDSession.authorize(authMethod, ')
  // const session = await DIDSession.authorize(authMethod, {resources})
  // ceramic.did = session.did   
  // const session = await DIDSession.authorize(authMethod, { resources: [...]})
  // const provider = new EthereumAuthProvider(window.ethereum, address[0])
  // await threeIdConnect.connect(provider)
  // const did = new DID({       // problem here
  //   // provider: session.getDidProvider(), 
  //   resolver: {
  //     ...ThreeIdResolver.getResolver(ceramic),
  //     ...getKeyResolver(),
  //   },
  // })
  // create the DID 
  // ceramic.setDID(did)
  // authenticate user:   
  // await ceramic.did.authenticate()              // PROBLEM HERE
  // create data schema and pass it to ceramic 
  // const idx = new IDX({ceramic})
  // console.log('idx ' , idx)

  //pass the newly received data into the data schema called ix

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