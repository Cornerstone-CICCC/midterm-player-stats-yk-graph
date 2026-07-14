import express from 'express'
import dotenv from 'dotenv'
import { testConnection } from './db/pool.js'

dotenv.config()

const app = express()
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

const PORT = Number(process.env.PORT) || 3000

app.listen(PORT, async () => {
  await testConnection()
  console.log(`[Success] Server running on http://localhost:${PORT}`)
})
