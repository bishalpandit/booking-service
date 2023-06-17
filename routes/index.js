import { Router } from 'express'
import bookingRoutes from './booking.routes.js'

const router = Router();

router.use('/', bookingRoutes);

export default router;