const User = require('./models/user');
const CalendarData = require('./models/calendarData');

const bcrypt = require('bcryptjs')
const saltRounds = 10;

hashPassword = async (password) => {
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    return hashedPassword;
}

const userData = [
    { 
        name: 'Dylan', 
        group: 1, 
        role: 'Student', 
        modules: JSON.stringify(['EE4218', 'EE2026', 'EE2028']), 
        email: 'dylan_pang@u.nus.edu', 
        password: '123'
    }
]; 

// Checks current state of table in DB and performs neccessary changes according to model
(async () => {
    // DB init here
    await User.sync({ force: true }); // For testing only, s/force/alter when done
    await CalendarData.sync({ force: true }); // For testing only, s/force/alter when done
    console.log("Tables initialized");
    
    // Hash passwords
    for (const user of userData) {
        const hashedPassword = await hashPassword(user.password);
        user.password = hashedPassword;
    }

    // Seed data here
    await User.bulkCreate(userData);
    console.log('Data seeded successfully');
    process.exit();
})();
