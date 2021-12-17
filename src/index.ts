import dotenv from 'dotenv'

import { tryParseInt } from './lib'
import { server } from './server'

dotenv.config()

server(tryParseInt(process.env.APP_PORT))
