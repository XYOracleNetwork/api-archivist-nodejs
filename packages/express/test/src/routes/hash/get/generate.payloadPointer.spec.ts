import { XyoAccount } from '@xyo-network/account'
import { PayloadAddressRule, PayloadArchiveRule, PayloadPointerBody, payloadPointerSchema, PayloadSchemaRule } from '@xyo-network/archivist-model'
import { BoundWitnessBuilder } from '@xyo-network/boundwitness'
import { XyoPayloadBuilder } from '@xyo-network/payload'

describe.skip('Generation of automation payload pointers', () => {
  const schemas = [
    'network.xyo.crypto.market.uniswap',
    'network.xyo.crypto.market.coingecko',
    'network.xyo.blockchain.ethereum.gas.etherchain.v2',
    'network.xyo.blockchain.ethereum.gas.etherchain.v1',
    'network.xyo.blockchain.ethereum.gas.etherscan',
    // 'network.xyo.crypto.asset',
  ]
  it.each(schemas)('Generates automation witness payload for %s schema', (schema) => {
    // const addressRule: PayloadAddressRule = { address: 'ce2fac75093bfe0a8c87b9e2404cb025c911d852' } // Beta 'network.xyo.crypto.asset'
    const addressRule: PayloadAddressRule = { address: '277307c04d552aaa0d2bb67fb2722026f2e8a866' } // Beta witnesses ('network.xyo.crypto.market.uniswap')
    // const addressRule: PayloadAddressRule = { address: '4618fce2a84b9cbc64bb07f7249caa6df2a892c7' } // Prod
    const archiveRule: PayloadArchiveRule = { archive: 'crypto-price-witness' }
    const schemaRule: PayloadSchemaRule = { schema }
    const fields: PayloadPointerBody = { reference: [[addressRule], [archiveRule], [schemaRule]], schema: payloadPointerSchema }
    const payload = new XyoPayloadBuilder<PayloadPointerBody>({ schema: payloadPointerSchema }).fields(fields).build()
    const bw = new BoundWitnessBuilder({ inlinePayloads: true }).witness(XyoAccount.random()).payload(payload).build()
    console.log(`==== ${schema} ====`)
    console.log(JSON.stringify(bw, undefined, 2))
    console.log('===========================================')
  })
})
