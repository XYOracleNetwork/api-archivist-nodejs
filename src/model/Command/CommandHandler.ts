import { Handler } from '../Domain'
import { Command } from './Command'

export interface CommandHandler<T extends Command> extends Handler<T, void> {
  handle(command: T): Promise<void>
}
