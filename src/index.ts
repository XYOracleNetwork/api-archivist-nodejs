import { tryParseInt } from '@xylabs/sdk-api-express-ecs'
import { config } from 'dotenv'

import { app } from './server'

config()

const server = app.listen(tryParseInt(process.env.APP_PORT))
server.setTimeout(3000)
