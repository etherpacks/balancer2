const fs = require('fs')

const balancer = require('@balancer-labs/v2-deployments')

const dpack = require('dpack')

async function build(network) {
  const builder = new dpack.PackBuilder(network)
  const json = JSON.stringify
    
  const Vault_artifact = {
    abi: await balancer.getBalancerContractAbi('20210418-vault', 'Vault'),
    bytecode: await balancer.getBalancerContractBytecode('20210418-vault', 'Vault')
  }
  const WeightedPoolFactory_artifact = {
    abi: await balancer.getBalancerContractAbi('20210418-weighted-pool', 'WeightedPoolFactory'),
    bytecode: await balancer.getBalancerContractBytecode('20210418-weighted-pool', 'WeightedPoolFactory')
  }
    const WeightedPool_artifact = {
	abi: await balancer.getBalancerContractAbi('20210418-weighted-pool', 'WeightedPool'),
	bytecode: await balancer.getBalancerContractBytecode('20210418-weighted-pool', 'WeightedPool')
    }
    
    fs.writeFileSync(`./link/Vault.json`, json(Vault_artifact))
    fs.writeFileSync(`./link/WeightedPool.json`, json(WeightedPool_artifact))
    fs.writeFileSync(`./link/WeightedPoolFactory.json`, json(WeightedPoolFactory_artifact))
    

    let alias = network;
    if (network == 'ethereum') {
	alias = 'mainnet';
    }
  await builder.packObject({
    objectname: 'vault',
    address: await balancer.getBalancerContractAddress('20210418-vault', 'Vault', alias),
    typename: 'Vault',
    artifact: Vault_artifact
  })
  await builder.packObject({
    objectname: 'weighted_pool_factory',
    address: await balancer.getBalancerContractAddress('20210418-weighted-pool', 'WeightedPoolFactory', alias),
    typename: 'WeightedPoolFactory',
    artifact: WeightedPoolFactory_artifact
  })
  await builder.packType({
    typename: 'WeightedPool',
    artifact: WeightedPool_artifact
  })

  const pack = await builder.build();
  fs.writeFileSync(`./pack/balancer2_${network}.dpack.json`, JSON.stringify(pack, null, 2));
}

build('ethereum')
build('kovan')
build('goerli')
build('rinkeby')
build('arbitrum')
