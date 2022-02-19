import { Counters } from '@xylabs/sdk-api-express-ecs'
import { Application, NextFunction, Request, Response } from 'express'

export const useRequestCounters = (app: Application): void => {
  // Configure Global counters
  app.use((req: Request, res: Response, next: NextFunction) => {
    Counters.inc(req.path)
    Counters.inc('_calls')
    next()
  })

  app.get('/stats', (req: Request, res: Response, next: NextFunction) => {
    /* #swagger.tags = ['Metrics'] */
    /* #swagger.summary = 'Get the counters for single instance of archivist' */
    res.json({
      alive: true,
      avgTime: `${((Counters.counters['_totalTime'] ?? 0) / (Counters.counters['_calls'] ?? 1)).toFixed(2)}ms`,
      counters: Counters.counters,
    })
    next()
  })
}
