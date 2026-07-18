import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'

import { testConnection } from './db/pool.js'
import optionsRouter from './routes/options.js'
import performancesRouter from './routes/performances.js'
import rankingsRouter from './routes/rankings.js'

dotenv.config()

const app = express()
app.use(cors({ origin: 'http://localhost:4321' }))
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/performances', performancesRouter)
app.use('/api/rankings', rankingsRouter)
app.use('/api/options', optionsRouter)

const PORT = Number(process.env.PORT) || 3000

app.listen(PORT, async () => {
  await testConnection()
  console.log(`[Success] Server running on http://localhost:${PORT}`)
})
