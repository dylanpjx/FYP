const Ticket = require('./models/Ticket');
const nodemailer = require('nodemailer');

const handleTicket = async (req, res) => {
    const { name, email, description, ticketType } = req.body;

    try {
        const newTicket = await Ticket.create({
            name,
            email,
            description,
            ticketType
        });

        //create reusable transporter object using default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'premises97@gmail.com',
                pass: process.env.MAIL_PASS
            }
        });

        //send email with defined transport object
        let info = await transporter.sendMail({
            from: 'premises97@gmail.com',
            to: 'ticketsystem.fyp@gmail.com',
            subject: 'New Ticket Filed',
            html: `<p> A new ticket has been filed with the following details:</p>
                  <p>Name: ${name}</p>
                  <p>Email: ${email}</p>
                  <p>Ticket Type: ${ticketType}</p>
                  <p>Description: ${description}</p>`,
        });

        return res.status(201).send(`Ticket successfully filed.`);
      
    } catch (err) {
        console.error('Error filing ticket.', err);
        res.status(500).send('Internal server error');
    }
};

exports.handleTicket = handleTicket;
