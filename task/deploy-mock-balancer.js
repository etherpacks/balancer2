const fs = require('fs')
const path = require('path')

const dpack = require('@etherpacks/dpack')
const { task } = require('hardhat/config')

task('deploy-mock-balancer', 'deploy mock Balancer')
.setAction(async (args, hre) => {
  const [ signer ]  = await hre.ethers.getSigners()
  const deployer = signer.address
  const weth_pack = args.weth_pack
  const pack = require('../pack/balancer2_ethereum.dpack.json')  // reference deployment for mocks
  const dapp = await dpack.load(pack, hre.ethers, signer)
  const vault = await dapp._types.Vault.deploy(deployer, weth_pack.objects.weth9.address, 1000, 1000)
  const weighted_pool_factory = await dapp._types.WeightedPoolFactory.deploy(vault.address)
  const mockpack = JSON.parse(JSON.stringify(pack))
  mockpack.network = hre.network.name
  mockpack.objects.vault.address = vault.address
  mockpack.objects.weighted_pool_factory.address = weighted_pool_factory.address
  const mockpath = path.join(__dirname, `../pack/balancer2_${hre.network.name}.dpack.json`)
  const mockjson = JSON.stringify(mockpack, null, 2)
  fs.writeFileSync(mockpath, mockjson)
  return mockpack
})
