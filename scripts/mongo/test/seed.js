/* eslint-disable */
const {XyoAddress} = require('@xyo-network/account')
const {XyoBoundWitnessBuilder} = require('@xyo-network/boundwitness')
const {XyoPayloadBuilder} = require('@xyo-network/payload')

const schema = 'co.coinapp.current.user.witness'
const archives = ['testA', 'testB', 'testC', 'testD']
const records = 10000

const address = XyoAddress.fromPhrase('test')
const payloadTemplate = { 
  balance: 10000.00000000000,
  daysOld: 1,
  deviceId: '77040732-4c6d-47e1-af15-06159b51d879',
  geomines: 1,
  planType: 'pro',
  schema,
  uid: "1AAAA1AAA1AAAAAA1AAAAA11AAA1"
}

for (let archive = 0; archive < archives.length; archive++) {
  const boundWitnesses = []
  const payloads = []
  for (let i = 0; i < records; i++) {
    const _archive = archives[archive]
    const payload = new XyoPayloadBuilder({schema}).fields({
        ...payloadTemplate,
        daysOld: i,
        geomines: i,
    }).build()
    const boundWitness = new XyoBoundWitnessBuilder({ inlinePayloads: false })
      .witness(address)
      .payload(payload)
      .build()
    payloads.push({...payload, _archive})
    boundWitnesses.push({...boundWitness, _archive})
  }
  db.bound_witnesses.insertMany(boundWitnesses)
  db.payloads.insertMany(payloads)
}
