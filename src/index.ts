import { tryParseInt } from '@xylabs/sdk-api-express-ecs'
import dotenv from 'dotenv'

import { server } from './server'

dotenv.config()

server(tryParseInt(process.env.APP_PORT))
