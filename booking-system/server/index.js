const express = require('express');
const app = express();

const router = express.Router()
app.use('/', router);

const bcrypt = require('bcryptjs')
const saltRounds = 10;

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const cors = require('cors')
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const { Sequelize } = require("sequelize");

const User = require('./models/user');

const allowedOrigins = ['http://localhost:3000']
const TIME_LIMIT = 2 // in hours

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not allow access fro the specified origin'
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));


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


router.post('/register', (req, res) => {

});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    User.findOne({
        where: {
            email: email
        }
    }).then(user => {
        if (!user) {
            return res.status(400).send('Username not found');
        }
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                throw err;
            }
            if (!result) {
                return res.status(400).send('Incorrect password');
            }
            
            const token = jwt.sign({
                name: user.name,
                group: user.group,
                role: user.role,
                modules: user.modules
            }, 'secretkey', {expiresIn: '3h'});

            res.send({ token });
        });
    }).catch(err => {
        console.error('Error authenticating user:', err);
        res.status(500).send('Internal server error');
    });
});

router.get('/', (req, res) => {
  res.send('Hello World!')
});

const stm32Router = require('./stm32Router')
app.use("/stm32", stm32Router)

app.listen(5000, () => console.log("Server started on port 5000"));

module.exports = router;
