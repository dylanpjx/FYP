const Event = require('./models/Event');

const TIMELIMIT = 4 // in hours

// GET
const getEvents = async (req, res) => {
    try {
        const events = await Event.findAll();
        return res.json(events);

    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving calendar data');
    }
}

// DELETE
const deleteEvent = async (req, res) => {
    const { id } = req.params;

    try {
        const event = await Event.findByPk(id);
        if (!event) {
            return res.status(404).send('Event not found');
        }

        await event.destroy();

        res.send(id);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting event');
    }
}


// POST
const createEvent = async (req, res) => {
    const event = req.body;
    
    try {
        // Check if group has already booked n hours of events +
        // Check if any other group has already booked that timeslot
        const events = await Event.findAll({ where:
            { group_id: event.group_id } });

        let totalDuration = 0;
        for (const event of events){
            totalDuration += event.end - event.start;
        }
        totalDuration += new Date(event.end) - new Date(event.start);
        totalDuration /= (60*60*1000); // convert to hours
        console.log(totalDuration);

        if (totalDuration > TIMELIMIT) {
            return res.status(400).send('Group has exceeded their booking limit of: ' + TIMELIMIT + 'h');
        } 

        // Else, create event by appending event id
        const maxId = await Event.max('event_id') + 1;
        const newEvent = {
            ...event,
            event_id: maxId
        }
        await Event.create(newEvent);

        res.status(200).send(newEvent);

    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating event');
    }
}

// PUT
const modifyEvent = async (req, res) => {
    const event = req.body;

}

exports.getEvents = getEvents;
exports.deleteEvent = deleteEvent;
exports.createEvent = createEvent;
exports.modifyEvent = modifyEvent;
