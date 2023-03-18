const Ticket = require('./models/Ticket');

const handleTicket = async (req, res) => {
    const { name, email, description, ticketType } = req.body;

    try {
        const newTicket = await Ticket.create({
            name,
            email,
            description,
            ticketType,
        });
        return res.status(201).send(`Ticket successfully filed.`);
      
    } catch (err) {
        console.error('Error filing ticket.', err);
        res.status(500).send('Internal server error');
    }
};

exports.handleTicket = handleTicket;
