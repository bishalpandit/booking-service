import { db } from "../configs/index.js";

export const getSeats = async (req, res) => {
    try {
        const seats = await db.query(`select *
         from seats
         order by class;
        `);

        console.log(seats);

        res.status(200).json({
            data: seats.rows
        });
    } catch (error) {
        res.status(400).json({
            error: error,
            message: "Something went wrong!",
        });
    }
};

export const getSeatById = async (req, res) => {
    try {
        const id = req.seat_id;

        const seatRow = await db.query(`select s.id, seat_identifier, is_booked,
            s.class, min_price, normal_price, max_price
            from seats s, seat_class_pricing p
            where s.class = p.seat_class and s.id = ${id};
        `);

        const seat = seatRow.rows[0];
        let seatClass = seat.class;

        const seatClassCount = await db.query(`select count(*)
            from seats
            where class = ${"'" + seatClass + "'"};
        `);

        const bookedSeatClassCount = await db.query(`select count(*)
            from seats
            where class = ${"'" + seatClass + "'"} and is_booked = true;
        `);

        const bookedSeatPercentage = (bookedSeatClassCount/seatClassCount * 100).toFixed(2);

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

        if (price === -1) {
            throw new Error("Price not available");
        }

        const seatDetails = {
            id: seat.id,
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
            error: error,
            message: "Something went wrong!",
        });
    }
};