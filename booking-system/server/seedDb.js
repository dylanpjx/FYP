const User = require('./models/User');
const Event = require('./models/Event');

const userData = require('./seed_data/userData');
const eventData = require('./seed_data/eventData');

const bcrypt = require('bcryptjs')
const saltRounds = 10;

hashPassword = async (password) => {
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    return hashedPassword;
}

// Checks current state of table in DB and performs neccessary changes according to model
(async () => {
    // DB init here
    await User.sync({ force: true }); // For testing only, s/force/alter when done
    await Event.sync({ force: true }); // For testing only, s/force/alter when done
    console.log("Tables initialized");
    
    // Hash passwords
    for (const user of userData) {
        const hashedPassword = await hashPassword(user.password);
        user.password = hashedPassword;
    }

    // Seed data here
    await User.bulkCreate(userData);
    await Event.bulkCreate(eventData);
    console.log('Data seeded successfully');
    process.exit();
})();
