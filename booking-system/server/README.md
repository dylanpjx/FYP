# Server instructions

## npm run dev
Upon `npm run dev` =>
    `node seed_db.js`:
    This will drop all users in the table except for those found in `userData`.

    and 

    `nodemon index.js`:
    This will monitor for changes in index.js and will automatically restart backend.


## Login

For testing, you could add your own name in userData and use that as an admin account for logging in.

## Registration

1. Admin will upload student data (.csv) into the backend in `student_data/`, this can be done using `wget`, `curl` or manually creating the files. The filename of the `.csv` should be the module name, eg. EE2026.csv
2. Only valid emails, ie. emails of students enrolled in the modules (emails in csv), will be allowed to register
3. A user can only register once with their email, they cannot create multiple accounts

## DB creation and viewing

```
SHOW schemas; /* Show all active DBs */
CREATE DATABASE fyp; /* or USE fyp */

/* After running `node seed_db.js` */
SELECT * from Events;
SELECT * from Calendar;
```
