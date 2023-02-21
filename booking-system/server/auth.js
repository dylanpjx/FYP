const bcrypt = require('bcryptjs')
const saltRounds = 10;

const fs = require('fs');
const path = require('path');
const parse = require('csv-parse').parse;

const jwt = require('jsonwebtoken');

const User = require('./models/user');
const userCsvDir = './student_data/'

const handleRegister = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // Check db if user already exists
        const existingUser = await User.findOne({ where: { email }})
        if (existingUser) {
            return res.status(400).send('User with this email already exists');
        }

        const checkForMatch = (email, fileData) => {
            return new Promise((resolve) => {
                parse(fileData, { columns: true, bom: true }, (err, records) => {
                    const match = records.find((record) => record.email === email);
                    resolve(match);
                });
            });
        }

        // Check csv files if user exists
        const userCsvFiles = fs.readdirSync(userCsvDir)
        let userData = null;
        let modules = [];

        for (const userCsvFile of userCsvFiles) {
            const fileData = fs.readFileSync(`${userCsvDir}/${userCsvFile}`, 'utf8');

            userData = await checkForMatch(email, fileData);
            if (userData)
                modules.push(path.parse(userCsvFile).name);
        }
        
        userData = { ...userData, modules: JSON.stringify(modules) };

        if (!userData) {
            res.status(400).send('User with this email not found');
        }
        
        // Hash password and create new user
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(userData)

        const newUser = await User.create({
            name: userData.name,
            group: userData.group,
            role: userData.role,
            modules: userData.modules,
            email,
            password: hashedPassword,
        });
        return res.status(201).send(`User ${newUser.name} created`);

    } catch (err) {
        console.error(err);
        return res.status(500).send('Error registering user');
    }
};

const handleLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email }});
        if (!user) {
            return res.status(400).send('Email not found');
        }
        
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).send('Incorrect password');
        }

        const token = jwt.sign({
            name: user.name,
            group: user.group,
            role: user.role,
            modules: user.modules
        }, 'secretkey', {expiresIn: '3h'});

        res.send({ token });
    } catch (err) {
        console.error('Error authenticating user:', err);
        res.status(500).send('Internal server error');
    }
};

exports.handleLogin = handleLogin;
exports.handleRegister = handleRegister;
