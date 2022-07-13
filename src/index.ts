import { config } from 'dotenv'
config()
import { tryParseInt } from '@xylabs/sdk-api-express-ecs'

import { server } from './server'

void server(tryParseInt(process.env.APP_PORT))
