import { Router } from 'express'
import { findPlayerOptions, findMatchOptions } from '../queries/options.js'

const router = Router()

router.get('/players', async (_req, res, next) => {
  try {
    const rows = await findPlayerOptions()
    res.json({ data: rows })
  } catch (err) {
    next(err)
  }
})

router.get('/matches', async (_req, res, next) => {
  try {
    const rows = await findMatchOptions()
    res.json({ data: rows })
  } catch (err) {
    next(err)
  }
})

export default router
