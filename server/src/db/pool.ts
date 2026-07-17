import pg, { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

// NUMERIC (1700): pg returns a string for precision; we only need float values.
pg.types.setTypeParser(1700, (val) => parseFloat(val))

// DATE (1082): keep as 'YYYY-MM-DD' string; a JS Date would shift the day via timezone.
pg.types.setTypeParser(1082, (val) => val)

export const pool = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
})

export async function testConnection(): Promise<void> {
  const client = await pool.connect()
  try {
    await client.query('SELECT 1')
    console.log('[Success] Database connected!!!')
  } finally {
    client.release()
  }
}
