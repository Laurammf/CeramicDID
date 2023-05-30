import './App.css';
import { useState } from 'react'

import { DIDSession } from 'did-session'
import { EthereumWebAuth, getAccountId } from '@didtools/pkh-ethereum'
// import  DID  from 'dids' //removed brackes bc of stackoverflow post#
import { DID } from 'dids'
import { IDX } from '@ceramicstudio/idx'
import { img } from './images/img'
import CeramicClient from '@ceramicnetwork/http-client'
import { ThreeIdConnect } from '@3id/connect'
import KeyDidResolver from 'key-did-resolver'
import { Ed25519Provider } from 'key-did-provider-ed25519'
import * as KeyResolver from 'key-did-resolver'
import { fromString } from "uint8arrays";


//  const endpoint = "https://localhost:7007"                   // 1 OKO 
const endpoint = "https://gateway-clay.ceramic.network"      // 2 
// const endpoint = "http://192.168.188.58:7007/"
//  const endpoint = "https://ceramic-clay.3boxlabs.com"



function App() {
  //create states for the data to be loaded and for the state of loadness
  const [name, setName] = useState('')
  const [image, setImage] = useState('')
  const [loaded, setLoaded] = useState(false)




  async function readProfile() {
    const ceramic = new CeramicClient(endpoint) 
    const ethProvider = window.ethereum
    const addresses = await ethProvider.request({ method: 'eth_requestAccounts' })
    const accountId = await getAccountId(ethProvider, addresses[0])
    const authMethod = await EthereumWebAuth.getAuthMethod(ethProvider, accountId)
    const session = await DIDSession.authorize(authMethod, { resources: [`ceramic://*`]})


    const idx = new IDX({ ceramic })
        try {
          const data = await idx.get(
           'basicProfile',
           `eip155:1:${addresses[0]}`    
                              
  )
    console.log(' ')
    console.log('if catch')
      if (data.name) setName(data.name)
      if (data.avatar) setImage(data.avatar)
    } catch (error) {

      console.log('error: ', error)
      console.log("error catched")
      setLoaded(true)
    }
  }
async function updateProfile(){

// Version 4 mix match 

const ceramic = new CeramicClient(endpoint) 
const ethProvider = window.ethereum
const addresses = await ethProvider.request({ method: 'eth_requestAccounts' })
const accountId = await getAccountId(ethProvider, addresses[0])
const authMethod = await EthereumWebAuth.getAuthMethod(ethProvider, accountId)


console.log('session = await DIDSession.authorize(authMethod, {resources})')  
const session = await DIDSession.authorize(authMethod, { resources: [`ceramic://*`]})
console.log(' ')
console.log('ceramic.setDID')
ceramic.setDID(session.did)                                       // ceramic.did = session.did 


console.log('')
console.log('seed 4 ')
const seed4 = fromString(
    "3686797791467013660892332599998067817022923247599682242140663892",
    "base16"
);
console.log('')
console.log('provider = new Ed25519Provider(seed4)')
const provider = new Ed25519Provider(seed4)
console.log('')
console.log('const did = new DID({ provider, resolver: KeyResolver.default.getResolver() })')
const did = new DID({ 
  provider, 
  resolver: KeyResolver.default.getResolver() 
})



await did.authenticate()   
 

console.log(' ')
console.log('const idx')
const idx = new IDX({ceramic})
console.log('idx ' , idx)

console.log('idx.set')
await idx.set('basicProfile', {
  name, 
  avatar:img 
})

console.log("end of the code")

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


