const express = require('express');
const app = express();
const router = express.Router()
const cors = require('cors')
const mysql = require('mysql');

const allowedOrigins = ['http://localhost:3000']
const TIME_LIMIT = 2 // in hours

const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'root',
    database: 'fyp3'
  });

db.connect(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    } else{
      console.log("Successfully connected to database!");
    }
    //first table has 7 columns: id, name, matricno, group, role, username, password
    let createTable = `create table if not exists userdata (id int auto_increment, StudentName varchar(255) null, MatricNo varchar(255) null, Group int null, Role varchar(255) null, Username varchar(255) not null, Password varchar(255) not null, PRIMARY KEY (id))`;
    //second table has 6 columns: id, date, group, starttime, endtime, duration
    let createTable2 = `create table if not exists bookings (id int auto_increment, Date varchar(255) not null, Group int not null, Start_time varchar(255) not null, End_time varchar(255) null, Duration varchar(255) not null, PRIMARY KEY(id))`;
    
    
    db.query(createTable, function(err, results, fields) {
      if (err) {
        console.log(err.message);
      }
    });
    db.query(createTable2, function(err, results, fields) {
      if (err) {
        console.log(err.message);
      }
    });
  
});
// TODO
//add Date (of the booking)
const bookingTimeCheck = async (req, res) => {
    const event = req.body
    const group = event.grp_id;
    const startTime = event.start;
    const endTime = event.end;
    const duration = (endTime - startTime) / (1000 * 60 * 60);

    // Retrieve the group's current booking total
    const bookingTotal = await db.query(
        `SELECT SUM (Duration) as total_duration FROM bookings WHERE Group = ${group}`
    );
    
    // Check if booking total has exceeded the limit for the week
    if (bookingTotal[0].total_duration + duration > TIME_LIMIT) {
        return res.status(400).json({ error: "Exceed booking time limit"})
    }
    
    // Save the booking to the databse
    await db.query(
        `INSERT INTO bookings (Group, Start_time, End_time, Duration) VALUES (${group}, ${startTime}, ${endTime}, ${duration})`
    );


    return res.status(200).json({ message: "Booking succesful" });
};



// const db = mysql.createConnection({
//     host: 'localhost',
//     user: '',
//     password: '',
//     database: ''
// })

// db.connect()

// db.query()

router.post("/register", (req, res) => {
    const { username, password } = req.body;
    const saltRounds = 10;

    bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) throw err;
    const sql = `INSERT INTO userdata (StudentName, MatricNo, Group, Role, Username, Password) VALUES ("${name}", "${matricno}", "${group}", "${role}", "${username}", "${password}")`; // TODO: add query

    connection.query(sql, (err, result) => {
      if (err) throw err;
      res.send('User registered successfully');
    });
  });
});

router.post("/login", (req, res) => {
    const { username, password } = req.body;
    const sql = `SELECT (Password) FROM userdata WHERE Username = ${username}`; // TODO: search query
    db.query(sql, (err, result) => {
        if (err) throw err;

        if (result.length === 0) return res.status(400).send("Username not found");

        const user = result[0];
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) throw err;
            if (!result) return res.status(400).send("Incorrect password");
            const token = jwt.sign({ id: user.id }, "secretkey", { expiresIn: "1h" });
            res.send({ token });
        })
    })

});

router.post("/calendar_data", (req, res) => {
    return bookingTimeCheck(req, res)
});

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

app.get("/calendar_data", (req, res) => {
    // TODO
    const events = require('./tmp_calendar_data.js');
    res.json(events)
});

app.put("/calendar_data/:id", (req, res) => {
    return bookingTimeCheck(req, res)
});

app.listen(5000, () => console.log("Server started on port 5000"));


module.exports = router;
