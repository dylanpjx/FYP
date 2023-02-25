const CalendarData = require('./models/Event');

const getCalendarData = async (req, res) => {
  try {
    const calendarData = await CalendarData.findAll();
    return res.status(200).json(calendarData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving calendar data' });
  }
};

const handleCreate = async (req, res) => {
  try {
    const { title, start, end, groupId, color, module } = req.body;
    const newEvent = await CalendarData.create({
      title, 
      start, 
      end, 
      groupId, 
      color, 
      module
    });
    console.log((newEvent.dataValues));

    const parsedEvent = JSON.stringify({
      ...newEvent.dataValues
    });
    console.log(parsedEvent);
    return res.status(201).json(parsedEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating new calendar event' });
  }
};

const handleEdit = async (req, res) => {
  try {
    const { event_id, title, start, end, groupId, color, module } = req.body;
    const existingEvent = await CalendarData.findByPk(event_id);
    if (existingEvent) {
      await existingEvent.update({
        title, 
        start, 
        end, 
        groupId, 
        color, 
        module
      });
      return res.status(200).json(JSON.stringify(existingEvent.dataValues));
    } else {
      return res.status(404).json({ message: `Calendar event ${event_id} not found` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Error updating calendar event ${event_id}` });
  }
};

const handleDelete = async (req, res) => {
  try {
    const event_id = req.body.event_id;
    const event = await CalendarData.findByPk(event_id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    await event.destroy();
    return res.status(200).send(`Deleted calendar event ${event_id}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting calendar event' });
  }
};

exports.getCalendarData = getCalendarData;
exports.handleCreate = handleCreate;
exports.handleEdit = handleEdit;
exports.handleDelete = handleDelete;