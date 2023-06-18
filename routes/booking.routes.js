import { Router } from 'express'
import { 
    getSeats, 
    getSeatById, 
    createBooking, 
    getBookingByUsernameOrPhone 
} from '../controllers/booking.controllers.js'

const router = Router()

// api/seats
router.get('/seats', getSeats);

// api/seats/id
router.get('/seats/:id', getSeatById);

// api/booking
router.post('/booking', createBooking);

// api/bookings?<usernameorphone>
router.get('/bookings', getBookingByUsernameOrPhone);

export default router;