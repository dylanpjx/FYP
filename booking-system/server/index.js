const express = require('express');
const app = express();

const router = express.Router()

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const cors = require('cors');
const mysql = require('mysql2');
const { Sequelize } = require("sequelize");

const allowedOrigins = ['http://localhost:3000']

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not allow access from the specified origin'
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));
app.use('/', router);

const sequelize = new Sequelize('fyp', 'root', 'root', {
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
const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ','')
    jwt.verify(token, 'secretkey');
    next();
  } catch (err) {
    console.error('Error verifying token:', err.message);
    return res.status(401).send('Unauthorized');
  }
};

// Protected route
router.post('/stm32', authMiddleware, stm32Router.handleSTM32)

app.listen(5000, () => console.log("Server started on port 5000"));

module.exports = router;
