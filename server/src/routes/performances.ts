import { Router } from 'express'
import { parsePagination } from '../utils/pagination.js'
import { findPerformances } from '../queries/performances.js'
import type { PerformanceListResponse } from '../types/performance.js'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const { limit, offset, page } = parsePagination(req.query)
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : ''
    const sort = typeof req.query.sort === 'string' ? req.query.sort : 'match_date'
    const order = req.query.order === 'asc' ? 'asc' : 'desc'

    const { rows, total } = await findPerformances({ limit, offset, search, sort, order })

    const response: PerformanceListResponse = {
      data: rows,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    }
    res.json(response)
  } catch (err) {
    next(err)
  }
})

export default router
