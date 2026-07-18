import { Router } from 'express'

import {
  findPerformances,
  findPerformanceById,
  createPerformance,
  updatePerformance,
  deletePerformance,
} from '../queries/performances.js'
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

router.post('/', async (req, res, next) => {
  try {
    const { player_id, match_id } = req.body ?? {}
    if (typeof player_id !== 'string' || typeof match_id !== 'string') {
      return res.status(400).json({ error: 'player_id and match_id are required' })
    }

    const id = await createPerformance(req.body)
    res.status(201).json({ data: { id } })
  } catch (err: any) {
    if (err?.code === '23503') {
      return res.status(400).json({ error: 'player_id or match_id does not exist' })
    }
    if (err?.code === '23505') {
      return res.status(409).json({ error: 'This player already has a record for this match' })
    }
    next(err)
  }
})

router.patch('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: 'Invalid id' })
    }

    const updated = await updatePerformance(id, req.body ?? {})
    if (!updated) {
      return res.status(404).json({ error: 'Performance not found or nothing to update' })
    }
    res.json({ data: { id } })
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: 'Invalid id' })
    }

    const deleted = await deletePerformance(id)
    if (!deleted) {
      return res.status(404).json({ error: 'Performance not found' })
    }
    res.status(204).send()
  } catch (err) {
    next(err)
  }
})

export default router
