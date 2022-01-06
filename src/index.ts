import { tryParseInt } from '@xylabs/sdk-api-express-ecs'
import { config } from 'dotenv'

import { server } from './server'

config()

server(tryParseInt(process.env.APP_PORT))
