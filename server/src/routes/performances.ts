import { Router } from 'express'

import { findPerformanceById, findPerformances } from '../queries/performances.js'
import { PerformanceListResponse } from '../types/performance.js'
import { parsePagination } from '../utils/pagination.js'

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

router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: 'Invalid id' })
    }

    const row = await findPerformanceById(id)
    if (!row) {
      return res.status(404).json({ error: 'Performance not found' })
    }

    res.json({ data: row })
  } catch (err) {
    next(err)
  }
})

export default router
