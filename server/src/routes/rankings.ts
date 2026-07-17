import { Router } from 'express'
import { parsePagination } from '../utils/pagination.js'
import { findRankings } from '../queries/performances.js'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const { limit, offset, page } = parsePagination(req.query)
    const { rows, total } = await findRankings(limit, offset)

    const data = rows.map((r) => ({
      ...r,
      matches_played: Number(r.matches_played),
      total_goals: Number(r.total_goals),
      total_assists: Number(r.total_assists),
    }))

    res.json({
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (err) {
    next(err)
  }
})

export default router
