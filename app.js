/*
    SETUP
*/

// Express
const express = require('express');  // We are using the express library for the web server
const app = express();               // We need to instantiate an express object to interact with the server in our code
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const PORT = 5386;

// Database
const db = require('./db-connector');

// Handlebars
const { engine } = require('express-handlebars'); // Import express-handlebars engine
app.engine('.hbs', engine({ extname: '.hbs' })); // Create instance of handlebars
app.set('view engine', '.hbs'); // Use handlebars engine for *.hbs files.

/*
    ROUTES
*/

app.get('/', async function (req, res) {
    try {
        res.render('home'); // Render the home.hbs file
    } catch (error) {
        console.error('Error rendering page:', error);
        // Send a generic error message to the browser
        res.status(500).send('An error occurred while rendering the page.');
    }
});

// GET Trainers page
app.get('/trainers', function(req, res) {
    // Display all Trainers
    let query1 = 'SELECT * FROM Trainers;';

    db.pool.query(query1, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.render('trainers', { trainers: rows });
        }
    });
});

// GET Classes page
app.get('/classes', function(req, res) {
    // Display all Classes
    let query1 = 'SELECT * FROM Classes;';
    // Display all Trainers
    let query2 = 'SELECT * FROM Trainers;';

    db.pool.query(query1, function(error, rows, fields) {
        if (error) {
            console.log("Query1 Error:");
            console.log(error);
            res.sendStatus(400);
            return;
        }
        let classes = rows;

        db.pool.query(query2, function(error, rows, fields) {
            if (error) {
                console.log("Query2 Error:");
                console.log(error);
                res.sendStatus(400);
                return;
            }
            let trainers = rows;

            res.render('classes', {
                classes: classes,
                trainers: trainers
            });
        });
    });
});

// GET Members page
app.get('/members', function(req, res) {
    let query1 = "SELECT * FROM Members;";
    let query2 = "SELECT * FROM Trainers;";

    db.pool.query(query1, function(error, rows, fields) {
        let members = rows;
        db.pool.query(query2, (error, rows, fields) => {
            let trainers = rows;
            res.render('members', { data: members, trainers: trainers });
        });
    });
});

// POST members page
app.post('/add-member', function(req, res) {
    let data = req.body;
    let query1 = `INSERT INTO Members (first_name, last_name, email, membership_start_date, trainer_id)
                  VALUES (?, ?, ?, ?, ?)`;
    let values = [data.first_name, data.last_name, data.email, data.membership_start_date, data.trainer_id || null];

    db.pool.query(query1, values, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/members');
        }
    });
});

// GET Equipment Records page
app.get('/equipment_records', function(req, res) {
    let query1 = "SELECT * FROM Equipment_Records;"; //

    db.pool.query(query1, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            // Render equipment_records.hbs and pass the rows as data
            res.render('equipment_records', { data: rows });
        }
    });
});

// POST Route to add new equipment
app.post('/add-equipment', function(req, res) {
    let data = req.body;
    let query1 = `INSERT INTO Equipment_Records (item_name, maintenance_status, purchase_date, location)
                  VALUES (?, ?, ?, ?)`;
    let values = [data.item_name, data.maintenance_status, data.purchase_date, data.location];

    db.pool.query(query1, values, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/equipment_records');
        }
    });
});

// GET Enrollments page
app.get('/enrollments', function(req, res) {
    // Join Members and Classes to get names
    let query1 = `SELECT Enrollments.enrollment_id, Members.first_name, Members.last_name,
                  Classes.class_name, Enrollments.signup_date
                  FROM Enrollments
                  JOIN Members ON Enrollments.member_id = Members.member_id
                  JOIN Classes ON Enrollments.class_id = Classes.class_id;`;

    // Get data for dropdowns
    let query2 = "SELECT member_id, CONCAT(first_name, ' ', last_name) AS member_name FROM Members;";
    let query3 = "SELECT class_id, class_name FROM Classes;";

    db.pool.query(query1, function(error, rows, fields) {
        let enrollments = rows;
        db.pool.query(query2, (error, rows, fields) => {
            let members = rows;
            db.pool.query(query3, (error, rows, fields) => {
                let classes = rows;
                res.render('enrollments', {
                    data: enrollments,
                    members: members,
                    classes: classes
                });
            });
        });
    });
});
/*
    LISTENER
*/

app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});