const { Op } = require('sequelize');

const Event = require('./models/Event');

const TIMELIMIT = 4 // in hours

const exceedLimit = async (event) => {
    const groupEvents = await Event.findAll({ 
        where: {
            [Op.and]: [
                { group_id: event.group_id },
                { event_id: { [Op.ne] : event.event_id } }
            ]
        }
    });
    let totalDuration = 0;
    for (const e of groupEvents){
        totalDuration += e.end - e.start;
    }
    totalDuration += new Date(event.end) - new Date(event.start);
    totalDuration /= (60*60*1000); // convert to hours

    return totalDuration > TIMELIMIT;
}

const overlapBooking = async (event) => {
    const overlappingEvents = await Event.findAll({
        where: {
            [Op.and]: [
                { event_id: { [Op.ne]: event.event_id } },
                {
                    [Op.or]: [
                        { start: { [Op.between]: [event.start, event.end] } },
                        { end: { [Op.lte]: [event.start] } },
                        { start: { [Op.lte]: event.start }, end: { [Op.gte]: event.end } },
                        { start: { [Op.gte]: event.start }, end: { [Op.lte]: event.end } },
                    ],
                },
            ],
        },
    });
    
    return overlappingEvents.length;
}

const noPermissions = async (event, eventInDb) => {
    if (event.role === "admin")
        return false;
    return event.group_id !== eventInDb.group_id;
}

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
        // Check if group has already booked n hours of events
        if (await exceedLimit(event)) {
            return res.status(400).send('Group has exceeded their booking limit of: ' + TIMELIMIT + 'h');
        }

        // Check if any other group has already booked that timeslot
        if (await overlapBooking(event)) {
            return res.status(400).send('Cannot create a booking that conflicts with another group');
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
    const { id } = req.params;

    try {
        const existingEvent = await Event.findByPk(id);
        console.log(event, existingEvent);

        if (!existingEvent) {
            return res.status(404).send(`Calendar event ${id} not found`);
        }
    
        // Check if user has relevant permissions
        if (await noPermissions(event, existingEvent)) {
            return res.status(404).send('User does not belong to the group or is not admin');
        }
        
        // Check if group has already booked n hours of events
        if (await exceedLimit(event)) {
            return res.status(400).send('Group has exceeded their booking limit of: ' + TIMELIMIT + 'h');
        }

        // Check if any other group has already booked that timeslot
        if (await overlapBooking(event)) {
            return res.status(400).send('Cannot create a booking that conflicts with another group');
        }
        
        await existingEvent.update(event);
        return res.status(200).send(existingEvent);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating calendar event')
    }

}

exports.getEvents = getEvents;
exports.deleteEvent = deleteEvent;
exports.createEvent = createEvent;
exports.modifyEvent = modifyEvent;
