require('dotenv').config()

const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

const router = express.Router()

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const mysql = require('mysql2');
const { Sequelize } = require("sequelize");

app.use('/', router);

const sequelize = new Sequelize('fyp', 'root', process.env.SQL_PASS, {
    host: 'localhost',
    dialect: 'mysql'
});

(async () => {
    try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
})();

router.get('/', (req, res) => {
  res.send('Hello World!')
});

const calendar = require('./calendar');
router.get('/calendar/:module/:group_id?', calendar.getEvents);
router.delete('/calendar/:id', calendar.deleteEvent);
router.put('/calendar/:id', calendar.modifyEvent);
router.post('/calendar', calendar.createEvent);

const auth = require('./auth');
router.post('/user', auth.handleRegister);
router.post('/login', auth.handleLogin);
router.put('/ssh/:id', auth.updateSSH);

const ticket = require('./fileticket');
router.post('/ticket', ticket.handleTicket);

const stm32Router = require('./stm32Router')
router.post('/stm32', stm32Router.handleSTM32)

app.listen(5000, () => console.log("Server started on port 5000"));

module.exports = router;
