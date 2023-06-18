import sgMail from '@sendgrid/mail'
import { MAIL_KEY } from '../configs/index.js'

sgMail.setApiKey(MAIL_KEY);

export const sendEmail = (recipient, bookingDetails) => {
    const message = {
        from: 'bishalpandit17@gmail.com',
        to: recipient,
        subject: `Seats Booking Details`,
        text: `Seats Booking Details for ${bookingDetails.name}`,
        html: `<p>Hi ${bookingDetails.name}, <br>
            <p>Your booking is done with ID - <strong>${bookingDetails.bookingId}</strong> and
            the total price is <strong>${bookingDetails.totalPrice}</strong>.</p> <br><br>
            <p>Thanks</p>
        `,
      };
      
    sgMail
    .send(message)
    .then((res) => console.log(res))
    .catch((err) => console.log(err));      
}
