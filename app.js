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
    let query1 = 'SELECT class_id, class_name, max_capacity, trainer_id, room_location FROM Classes;';    // Display all Trainers
    let query2 = 'SELECT * FROM Trainers;';

    db.pool.query(query1, function(error, rows) {
        if (error) {
            console.log("Query1 Error:");
            console.log(error);
            res.sendStatus(400);
            return;
        }
        let classes = rows;

        db.pool.query(query2, function(error, rows) {
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
    // JOIN with Trainers to get names instead of raw trainer_id
    let query1 = `SELECT Members.member_id, Members.first_name, Members.last_name,
                  Members.email, Members.phone_number, Members.membership_start_date,
                  Trainers.first_name AS trainer_first, Trainers.last_name AS trainer_last
                  FROM Members
                  LEFT JOIN Trainers ON Members.trainer_id = Trainers.trainer_id;`;

    let query2 = "SELECT * FROM Trainers;";

    db.pool.query(query1, function(error, rows, fields) {
        if (error) {
            console.log(error);
            return res.sendStatus(400);
        }
        let members = rows;
        db.pool.query(query2, (error, rows, fields) => {
            if (error) {
                console.log(error);
                return res.sendStatus(400);
            }
            let trainers = rows;
            res.render('members', { members: members, trainers: trainers });
        });
    });
});

// POST members page
app.post('/add-member', function(req, res) {
    let data = req.body;

    // if trainer is NULL
    let trainer = parseInt(data['input-trainer']);
    if (isNaN(trainer)) {
        trainer = null;
    }

    let query1 = `INSERT INTO Members (first_name, last_name, email, phone_number, membership_start_date, trainer_id)
                  VALUES (?, ?, ?, ?, ?, ?)`;

    let values = [
        data['input-fname'],
        data['input-lname'],
        data['input-email'],
        data['input-phone'],
        data['input-start-date'],
        trainer
    ];

    db.pool.query(query1, values, function(error, rows, fields) {
        if (error) {
            console.log("Add Member Error:", error);
            res.sendStatus(400);
        } else {
            res.redirect('/members');
        }
    });
});

// POST route to delete member
app.post('/delete-member', function(req, res) {
    let data = req.body;
    let memberID = parseInt(data['member_id']);

    let query1 = `DELETE FROM Members WHERE member_id = ?`;

    db.pool.query(query1, [memberID], function(error, rows, fields) {
        if (error) {
            console.log("Delete Member Error:", error);
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
            // Ceina - passing rows as equipment_records
            res.render('equipment_records', { equipment_records: rows });
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
    let query1 = `SELECT Enrollments.enrollment_id, Members.first_name, Members.last_name,
                  Classes.class_name, Enrollments.signup_date
                  FROM Enrollments
                  JOIN Members ON Enrollments.member_id = Members.member_id
                  JOIN Classes ON Enrollments.class_id = Classes.class_id;`;
    // let query1 = "SELECT * FROM Enrollments;";
    let query2 = "SELECT member_id, first_name, last_name FROM Members;";
    let query3 = "SELECT class_id, class_name FROM Classes;";

    db.pool.query(query1, function(error, rows, fields) {
        if (error) {
            console.log(error);
            return res.sendStatus(400);
        }
        let enrollments = rows;

        db.pool.query(query2, (error, rows, fields) => {
            if (error) {
                console.log(error);
                return res.sendStatus(400);
            }
            let members = rows;
            db.pool.query(query3, (error, rows, fields) => {
                if (error) {
                    console.log(error);
                    return res.sendStatus(400);
                }
                let classes = rows;
                // Ceina - passing enrollments as enrollments
                res.render('enrollments', {
                    enrollments: enrollments,
                    members: members,
                    classes: classes
                });
            });
        });
    });
});

// POST route Enrollments page
app.post('/add-enrollment', function(req, res)
{
    // capture data from the form
    let data = req.body;

    // prepare the query
    let query1 = `INSERT INTO Enrollments (member_id, class_id, signup_date)
                  VALUES (?, ?, CURRENT_DATE())`;

    let inserts = [data['input-member'], data['input-class']];

    // run the query
    db.pool.query(query1, inserts, function(error, rows, fields){
        if (error){
            console.log(error);
            res.sendStatus(400);
        } else{
            // send user back to enrollments page to see new record
            res.redirect('/enrollments');
        }
    });
});

// POST route to UPDATE Enrollments
app.post('/update-enrollment', function(req, res){
    let data = req.body;

    let enrollment_id = parseInt(data['update-id']);
    let member_id = parseInt(data['update-member']);
    let class_id = parseInt(data['update-class']);

    // query to update the row where the enrollment id matches the one selected
    let query = `UPDATE Enrollments
                 SET member_id = ?, class_id = ?
                 WHERE enrollment_id = ?`;
    let values = [member_id, class_id, enrollment_id];

    db.pool.query(query, values, function(error, rows, fields) {
        if (error){
            console.log("Update error:", error);
            res.sendStatus(400);
        } else{
            // redirect back to see updated table row
            res.redirect('/enrollments');
        }
    });
});

// POST route to delete an enrollment
app.post('/delete-enrollment', function(req, res) {
    let data = req.body;
    let enrollmentID = parseInt(data['enrollment_id']);

    let query = `DELETE FROM Enrollments WHERE enrollment_id = ?`;

    db.pool.query(query, [enrollmentID], function(error, rows, fields) {
        if (error) {
            console.log("Delete Error:", error);
            res.sendStatus(400);
        } else {
            // refresh the page so the row disappears from the table
            res.redirect('/enrollments');
        }
    });
});

// GET Classes and Equipments page
app.get('/classes_equipment', function (req, res) {
    let query1 = `SELECT Classes_Equipment.class_equipment_id, Classes.class_name, Equipment_Records.item_name
                  FROM Classes_Equipment
                  JOIN Classes ON Classes_Equipment.class_id = Classes.class_id
                  JOIN Equipment_Records ON Classes_Equipment.equipment_id = Equipment_Records.equipment_id;`;

    // Display all Classes
    let classesQuery = `SELECT class_id, class_name FROM Classes;`;

    // Display all Equipment_Records
    let equipmentQuery = `SELECT equipment_id, item_name FROM Equipment_Records;`;

    db.pool.query(query1, function (error, browseRows){
        if (error){
            console.log("Browse query error:", error);
            return res.sendStatus(400);
        }

        db.pool.query(classesQuery, function (error, classRows) {
            if (error) {
                console.log("Classes query error:", error);
                return;
            }

            db.pool.query(equipmentQuery, function (error, equipmentRows) {
                if (error) {
                console.log("Equipment query error:", error);
                return;
                }

                res.render('classes_equipment', {
                    data: browseRows, //sends the table data
                    classes: classRows, // sends class dropdown data
                    equipment_records: equipmentRows // sends equipment dropdown data
                });
            });
        });
    });
});

// POST route to add a new class_equipment assignment
app.post('/add-class-equipment', function(req, res) {
    let data = req.body;

    let query = `INSERT INTO Classes_Equipment (class_id, equipment_id) VALUES (?, ?)`;
    let values = [data['input-class'], data['input-equipment']];

    db.pool.query(query, values, function(error, rows, fields) {
        if (error) {
            console.log("Add M:M Error:", error);
            res.sendStatus(400);
        } else {
            res.redirect('/classes_equipment');
        }
    });
});

// POST route to UPDATE Class_Equipment assignment
app.post('/update-class-equipment', function(req, res) {
    let data = req.body;
    let query = `UPDATE Classes_Equipment SET class_id = ?, equipment_id = ? WHERE class_equipment_id = ?`;
    let values = [data['update-class'], data['update-equipment'], data['update-id']];

    db.pool.query(query, values, function(error) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/classes_equipment');
        }
    });
});

// POST route to delete Classes_Equipment assignment
app.post('/delete-class-equipment', function(req, res) {
    let data = req.body;
    let assignmentID = parseInt(data['class_equipment_id']);

    let query = `DELETE FROM Classes_Equipment WHERE class_equipment_id = ?`;

    db.pool.query(query, [assignmentID], function(error, rows, fields) {
        if (error) {
            console.log("Delete Error:", error);
            res.sendStatus(400);
        } else {
            // Refresh to see the item gone from the table
            res.redirect('/classes_equipment');
        }
    });
});

/*
    LISTENER
*/

app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});