const fs = require('fs')

const balancer = require('@balancer-labs/v2-deployments')

const dpack = require('dpack')

async function build(network) {
  const builder = new dpack.PackBuilder(network)

  await builder.packObject({
    objectname: 'vault',
    address: await balancer.getBalancerContractAddress('20210418-vault', 'Vault', network),
    typename: 'Vault',
    artifact: {
      abi: await balancer.getBalancerContractAbi('20210418-vault', 'Vault'),
      bytecode: await balancer.getBalancerContractBytecode('20210418-vault', 'Vault')
    }
  })
  await builder.packObject({
    objectname: 'weighted_pool_factory',
    address: await balancer.getBalancerContractAddress('20210418-weighted-pool', 'WeightedPoolFactory', network),
    typename: 'WeightedPoolFactory',
    artifact: {
      abi: await balancer.getBalancerContractAbi('20210418-weighted-pool', 'WeightedPoolFactory'),
      bytecode: await balancer.getBalancerContractBytecode('20210418-weighted-pool', 'WeightedPoolFactory')
    }
  })
  await builder.packType({
    typename: 'WeightedPool',
    artifact: {
      abi: await balancer.getBalancerContractAbi('20210418-weighted-pool', 'WeightedPool'),
      bytecode: await balancer.getBalancerContractBytecode('20210418-weighted-pool', 'WeightedPool')
    }
  })

  const pack = await builder.build();
  fs.writeFileSync(`./packs/balancer_${network}.dpack.json`, JSON.stringify(pack, null, 2));
}

build('mainnet')
build('kovan')
build('goerli')
build('rinkeby')
build('arbitrum')
