/* eslint-disable */
const schema = 'network.xyo.temp'
const archives = ['testA', 'testB', 'testC', 'testD']
const records = 100000
for (let archive = 0; archive < archives.length; archive++) {
  const boundWitnesses = []
  const payloads = []
  for (let record = 0; record < records; record++) {
    const _archive = archives[archive]
    const payload = {
      number_field: 1,
      object_field: {
        number_value: 2,
        string_value: 'yo',
      },
      schema,
      string_field: 'there',
      timestamp: 1618603439107,
    }
    const boundWitness = {
      addresses: ["46553499c8ca45a44c7dbb88fbc844390183a069"],
      payload_hashes: [
        "3c817871cbf24708703e907dbc344b1b2aefcc3603d14d59c3a35a5c446410d1"
      ],
      payload_schemas: [schema],
      previous_hashes: [null],
      _client: "js",
      _signatures: [
        "3044022034074e4ae7ee4f5747f6b30f66b76cecfb8ad9a26fa1839c73ecad75afa724eb02206b837660474af4a038e6f08b5f8b0b05054d6a985f766e00aec6f141ef1691a7"
      ],
      _timestamp: 1645283179762,  
    }  
    boundWitnesses.push({...boundWitness, _archive})
    payloads.push({...payload, _archive})
  }
  db.bound_witnesses.insertMany(boundWitnesses)
  db.payloads.insert(payloads)
}