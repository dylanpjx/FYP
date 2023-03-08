const bcrypt = require('bcryptjs')
const saltRounds = 10;

const fs = require('fs');
const path = require('path');
const parse = require('csv-parse').parse;

const jwt = require('jsonwebtoken');

const sshpk = require('sshpk');

const User = require('./models/User');
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
                parse(fileData, { 
                    columns: true,
                    bom: true,
                    cast: (value, context) => {
                        if (value === '') {
                            return null;
                        }
                        return value;
                    }
                }, (err, records) => {
                    let match = records.find((record) => record.email === email);
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

            const match = await checkForMatch(email, fileData);
            if (match) {
                userData = match;
                modules.push(path.parse(userCsvFile).name);
            }
        }

        userData = { ...userData, modules: JSON.stringify(modules) };

        if (!userData) {
            res.status(400).send('User with this email not found');
        }
        
        // Hash password and create new user
        const hashedPassword = await bcrypt.hash(password, 10);

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
            id: user.id,
            name: user.name,
            group: user.group,
            role: user.role,
            modules: user.modules,
            sshkey: user.sshkey
        }, 'secretkey', {expiresIn: '3h'});

        res.send({ token });
    } catch (err) {
        console.error('Error authenticating user:', err);
        res.status(500).send('Internal server error');
    }
};

const updateSSH = async (req, res) => {
    const publicKey = req.body.sshkey;
    const { id } = req.params;

    try {
        const parsedKey = sshpk.parseKey(publicKey);
        const user = await User.findOne({ where: { id }});
        user.sshkey = publicKey;
        await user.save();

        return res.status(200).send('Success: SSH key updated!');
    } catch (err) {
        return res.status(400).send('Invalid SSH public key');
    }
}

exports.handleLogin = handleLogin;
exports.handleRegister = handleRegister;
exports.updateSSH = updateSSH;
