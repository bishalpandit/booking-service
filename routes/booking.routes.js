import { Router } from 'express'
import { getSeats } from '../controllers/booking.controllers.js'
const router = Router()

// api/seats
router.get('/seats', getSeats)

export default router;