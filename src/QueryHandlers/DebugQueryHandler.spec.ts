import { DebugQuery, debugSchema } from '../model'
import { DebugQueryHandler } from './DebugQueryHandler'

const schema = debugSchema

describe('DebugQueryHandler', () => {
  it('delays for the specified amount of time supplied', async () => {
    const sut = new DebugQueryHandler()
    await sut.handle(new DebugQuery({ delay: 1, schema }))
  })
})
