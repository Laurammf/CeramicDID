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


 const endpoint = "https://localhost:7007"                   // 1 OKO 
  // const endpoint = "https://gateway-clay.ceramic.network"      // 2 
// const endpoint = "http://192.168.188.58:7007/"
//  const endpoint = "https://ceramic-clay.3boxlabs.com"

/**
 *
 * Now there is a new error without brackets at import when read profile
 * 
 * About the previous error: It was no provider avaliable or sth like this.
 * on npmjs package info for did it uses this in example code:
 * 
 * https://www.npmjs.com/package/dids
 * 
 * import { DID } from 'dids'
import { Ed25519Provider } from 'key-did-provider-ed25519'  <---- this might be needed in combination with the did package
import * as KeyResolver from 'key-did-resolver'

 */


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


// const resolver = {
//   ...KeyDidResolver.getResolver(ceramic),
//   ...ThreeIdResolver.getResolver(ceramic),
// }
// const did = new DID({resolver}

// console.log(' ')
// console.log('instanciate 3id connect')
// const threeIdConnect = new ThreeIdConnect()

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


// const did = new DID({       // problem here
//   // provider: ethProvider,
//   provider: authMethod,
//   resolver: {
//     ...KeyDidResolver.getResolver(ceramic),
//     // ...getKeyResolver(),
//   },
// })


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




  //   ceramic: ceramic,
  //   // index: false,
  //   // models: ['kjz16hvfrbw6ca7nidsnrv78x7r4xt0xki71nvwe4j5a3s9wgou8yu3aj8cz38e'],   // a     INVALID REF
  //   models: ['kjzl6hvfrbw6c7keo17n66rxyo21nqqaa9lh491jz16od43nokz7ksfcvzi6bwc']       // b
  //   // models: ['k2t6wyfsu4pg2qvoorchoj23e8hf3eiis4w7bucllxkmlk91sjgluuag5syphl'],       // c   refer to a tile
  // })


  // debugging pattern:
// console.log(' ')
// console.log('ceramic.setDID')
// console.log(session.did) 







// const ceramic = new CeramicClient(endpoint) 


// const ethProvider = window.ethereum
// const addresses = await ethProvider.request({ method: 'eth_requestAccounts' })
// const accountId = await getAccountId(ethProvider, addresses[0])
// const authMethod = await EthereumWebAuth.getAuthMethod(ethProvider, accountId)


// console.log('session = await DIDSession.authorize(authMethod, {resources})')  
// const session = await DIDSession.authorize(authMethod, { resources: [`ceramic://*`]})
// console.log(' ')
// console.log('ceramic.setDID')
// ceramic.setDID(session.did)                                       // ceramic.did = session.did 
// console.log('await authenticate')

// // const resolver = {
// //   ...KeyDidResolver.getResolver(ceramic),
// //   ...ThreeIdResolver.getResolver(ceramic),
// // }
// // const did = new DID({resolver})

// // const threeIdConnect = new ThreeIdConnect()
// // await threeIdConnect.setAuthProvider(ethProvider)
// // await threeIdConnect.connect(accountId)

// const did = new DID({       // problem here
//   // provider: threeIdConnect.getDidProvider(),
//   resolver: {
//     ...KeyDidResolver.getResolver(ceramic),
//     // ...getKeyResolver(),
//   },
// })

// // await did.authenticate({
// //   provider: ethProvider
// // })   

// // console.log(' ')
// // console.log('did debugging:')
// // console.log(did) 


// // console.log(' ')
// // console.log('did typeof:')
// // console.log(typeof(did)) 


// // console.log(' ')
// // console.log('did  authenticated?:')
// // console.log(did.authenticated) 

// // console.log(' ')
// // console.log('did set provider ethProvider:')
// // did.setProvider(ethProvider)


// // console.log('did provider ')
// // console.log(did.provider)
// // console.log(' ')


// // await did.authenticate({
// //   provider: ethProvider
// // })         // PROBLEM



// // console.log(' ')
// // console.log('did  authenticated after did.authenticate() ?:')
// // console.log(did.authenticated) 


// console.log(' ')
// console.log('const idx')
// const idx = new IDX({ceramic})
// console.log('idx ' , idx)

// console.log('idx.set')
// await idx.set('basicProfile', {
//   name, 
//   avatar:img 
// })

// console.log("end of the code")

// }