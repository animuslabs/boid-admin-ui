export const contractName = "boid"
export interface NetworkConfig {
  name:string
  chainId:string
  nodeUrl:string
  logo:string
}

export const endpoints:string[][] = [
  // 0
  ["EOS AtomicAssets", "https://eos.api.atomicassets.io"], // 1
  ["WAX AtomicAssets", "https://wax.eu.eosamsterdam.net"], // 2
  ["EOS AtomicHub", "https://eos.atomichub.io/explorer/asset/"], // 3
  ["EOS AtomicHub Templates", "https://eos.atomichub.io/explorer/template/"], // 4
  ["Nefty blocks Telos Testnet Assets", "https://telos-test.neftyblocks.com/assets/"], // 5
  ["Nefty blocks Telos Testnet Templates", "https://telos-test.neftyblocks.com/templates/"], // 6
  ["Nefty blocks Telos Assets", "https://telos.neftyblocks.com/assets/"], // 7
  ["Nefty blocks Telos Templates", "https://telos.neftyblocks.com/templates/"] // 8
]

export const EOSendpoints:string[][] = [
  ["Boid BP", "https://eos.api.boid.animus.is"],
  ["EOSphere", "https://eos.eosphere.io"],
  ["EOS Nation", "https://eos.api.eosnation.io"],
  ["EOS Amsterdam", "https://mainnet.eosamsterdam.net"],
  ["EOSeoul", "https://api.eoseoul.io"]
]

export const TelosEndpoints:string[][] = [
  ["Boid BP", "https://telos.api.boid.animus.is"],
  ["EOSphere", "https://telos.eosphere.io"],
  ["EOS Nation", "https://telos.api.eosnation.io"],
  ["TelosUSA", "https://telos.eosusa.io"],
  ["Caleos", "https://telos.caleos.io"],
  ["EOS Dublin", "https://telos.eosdublin.io"]
]

export const TelosTestnetEndpoints:string[][] = [
  ["Boid BP", "https://telos.testnet.boid.animus.is"],
  ["EOSphere", "https://telos-testnet.eosphere.io"],
  ["EOS Nation", "https://telostest.api.eosnation.io"],
  ["TelosUSA", "https://test.telos.eosusa.io"],
  ["Teleology One", "https://testnet.telos.teleology.one"]
]

export const trpcEndpoints:string[][] = [
  ["Boid Mainnet", "https://powerapi.animus.is/api"],
  ["Boid Testnet", "https://powerapi-testnet.animus.is/api"]
]

export const ipfsEndpoints:string[][] = [
  ["Boid IPFS", "https://ipfs.animus.is/ipfs/"],
  ["Infura IPFS", "https://ipfs.infura.io/ipfs/"],
  ["Pinata IPFS", "https://gateway.pinata.cloud/ipfs/"],
  ["Global IPFS", "https://ipfs.io/ipfs/"]
]

export const networks:NetworkConfig[] = [
  // default network should be first!!!
  {
    name: "telos",
    chainId: "4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11",
    nodeUrl: TelosEndpoints[0]?.[1] ?? "",
    logo: "./Telos-circle.png"
  },
  {
    name: "telostestnet",
    chainId: "1eaa0824707c8c16bd25145493bf062aecddfeb56c736f6ba6397f3195f33c9f",
    nodeUrl: TelosTestnetEndpoints[0]?.[1] ?? "",
    logo: "./Telos-circle.png"
  },
  {
    name: "eos",
    chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
    nodeUrl: EOSendpoints[0]?.[1] ?? "",
    logo: "https://bloks.io/img/chains/eos.png"
  }
  // {
  //   name: 'waxtestnet',
  //   chainId: 'f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12',
  //   nodeUrl: 'https://testnet.wax.pink.gg',
  //   logo: 'https://bloks.io/img/chains/wax.png',
  //   contracts: { avatarmk: Name.from('waxcontract1') },
  //   atomicMarket: 'https://wax-test.atomichub.io'
  //   atomicMarketApi: 'https://test.wax.api.atomicassets.io'
  // }
]

export function getNetworkByChainId(chainId:string):NetworkConfig {
  const network = networks.find((n) => n.chainId === chainId)
  if (!network) {
    throw new Error(`No network found for chainId ${chainId}`)
  }
  return network
}

export function activeNetwork():NetworkConfig {
  if (networks[0] === undefined) {
    throw new Error("No networks defined")
  }
  return networks[0]
}
