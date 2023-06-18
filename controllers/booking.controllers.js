import { db } from "../configs/index.js";

export const getSeats = async (req, res) => {
    try {
        const seats = await db.query(`select *
         from seats
         order by class;
        `);

        res.status(200).json({
            data: seats.rows
        });
    } catch (error) {
        res.status(400).json({
            error: error.message,
            message: "Something went wrong!",
        });
    }
};

export const getSeatById = async (req, res) => {
    try {
        const id = req.params.id;
        
        const seatRow = await db.query(`select *
            from seats
            where id = ${id};
        `);

        const seat = seatRow.rows[0];

        let price = await findSeatPricing(id);
        if (price === -1) {
            throw new Error("Price not available");
        }

        const seatDetails = {
            id,
            seat_identifier: seat.seat_identifier,
            seat_class: seat.class,
            price,
            isBooked: seat.is_booked
        };

        res.status(200).json({
            data: seatDetails
        });
    } catch (error) {
        res.status(400).json({
            error: error.message,
            message: "Something went wrong!",
        });
    }
};

export const createBooking = async (req, res) => {
    try {
        const bookingDetails = req.body;
        const { name, email, phone, seatIds } = bookingDetails;

        const errors = [];

        !name && errors.push('name is required');
        !email && errors.push('email is required');
        !phone && errors.push('phone is required');
        !seatIds && errors.push('seatIds is required');
        (seatIds && !(seatIds instanceof Array)) && errors.push('seatIds must be an array');
        (seatIds && seatIds instanceof Array && (seatIds.length == 0)) && errors.push('seatIds must be an array');

        if(errors.length > 0) {
            res.status(400);
            throw new Error(errors.join(', '));
        }

        for (let i = 0; i < seatIds.length; i++) {
            const seatId = seatIds[i];

            if ((await isSeatBooked(seatId))) {
                throw new Error('One or more seats are already booked!');
            }
        }

        const bookingPrices = [];

        for (let i = 0; i < seatIds.length; i++) {
            const seatId = seatIds[i];
            const price = await findSeatPricing(seatId);
            bookingPrices.push(price);
        }

        const totalPrice = bookingPrices.reduce((acc, val) => acc + val);

        const bookedSeatsCount = (await db.query(`select * from seat_booking`)).rowCount;

        let bookingId = 1;
        if (bookedSeatsCount != 0) {
            bookingId = bookedSeatsCount + 1;
        }

        const query = `INSERT INTO seat_booking(id, name, email, phone, seat_ids, booking_prices) 
        VALUES(${bookingId}, ${"'" + name + "'"}, ${"'" + email + "'"}, ${"'" + phone + "'"}, 
        ${"Array[" + seatIds + "]"}, ${"Array[" + bookingPrices +"]"})`;

        await db.query(query);

        for (let i = 0; i < seatIds.length; i++) {
            const seatId = seatIds[i];
            await db.query(`Update seats
                set is_booked = true
                where id = ${seatId}
            `)
        }

        res.status(200).json({
            data: {
                bookingId,
                totalPrice
            }
        });
    } catch (error) {
        res.status(400).json({
            error: error.message,
            message: "Something went wrong!",
        });
    }
};

const findSeatPricing = async (id) => {
    const seatRow = await db.query(`select s.id, seat_identifier, is_booked,
        s.class, min_price, normal_price, max_price
        from seats s, seat_class_pricing p
        where s.class = p.seat_class and s.id = ${id};
    `);

    const seat = seatRow.rows[0];
    let seatClass = seat.class;
    
    const seatClassCount = (await db.query(`select count(*)
    from seats
    where class = ${"'" + seatClass + "'"};
    `)).rows[0].count;

    const bookedSeatClassCount = (await db.query(`select count(*)
        from seats
        where class = ${"'" + seatClass + "'"} and is_booked = true;
    `)).rows[0].count;

    const bookedSeatPercentage = (parseFloat(bookedSeatClassCount)/parseFloat(seatClassCount) * 100);

    let price = -1;

    if (bookedSeatPercentage > 60 || bookedSeatPercentage  < 40) {
        if (bookedSeatPercentage > 60 && seat.max_price)
            price = seat.max_price;
        else if (bookedSeatPercentage < 40 && seat.min_price)
            price = seat.min_price;
        else 
            price = seat.normal_price;
    } else {
        if (seat.normal_price)
            price = seat.normal_price;
        else
            price = seat.max_price;
    }

    return price;
};

const isSeatBooked = async (id) => {
    const seatRow = await db.query(`select *
        from seats
        where id = ${id}
    `);

    const seat = seatRow.rows[0];

    return seat.is_booked;
}

export const getBookingByUsernameOrPhone = async (req, res) => {
    try {
        const query = req.query;
        let { email, phone } = query;

        if (!email && !phone) {
            throw new Error("Provide either email or phone number");
        }

        let booking;
        console.log(email, phone)

        if (email) {
            booking = await db.query(`select *
                from seat_booking
                where email = ${"'" + email + "'"}
            `);
        } else {
            booking = await db.query(`select *
                from seat_booking
                where phone = ${"'" + phone + "'"}
            `);
        }

        res.status(200).json({
            data: booking.rows[0]
        });
    } catch (error) {
        res.status(400).json({
            error: error.message,
            message: "Something went wrong!",
        });
    }
};