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
            return res.status(400).send(error);
        } else {
            res.render('trainers', { trainers: rows });
        }
    });
});

// CREATE Trainer
app.post('/add_trainer', function(req, res) {
    let data = req.body;

    // Convert empty dropdown value into SQL NULL
    let specialization =
        data.add_trainer_specialization == ""
            ? null
            : data.add_trainer_specialization;

    let query = `
        INSERT INTO Trainers (first_name, last_name, specialization, hourly_rate)
        VALUES (?, ?, ?, ?)
    `;

    let values = [
        data.add_trainer_first_name,
        data.add_trainer_last_name,
        specialization,
        data.add_trainer_hourly_rate
    ];

    db.pool.query(query, values, function(error) {
        if (error) {
            console.log(error);
            return res.status(400).send(error);
        } else {
            res.redirect('/trainers');
        }
    });
});

// UPDATE Trainer
app.post('/update_trainer', function(req, res, next) {
    let data = req.body;

let trainerID = data.update_trainer_id;

    // First get current trainer data
    let selectQuery = `
        SELECT * FROM Trainers
        WHERE trainer_id = ?;
    `;

    db.pool.query(selectQuery, [trainerID], function(error, rows) {

        if (error) {
            console.log(error);
            return res.status(400).send(error);
        }

        // Trainer not found
        if (rows.length === 0) {
            return res.status(404).send("Trainer not found");
        }

        let currentTrainer = rows[0];

        // Use existing value if field left blank
        let firstName =
            !data.update_trainer_first_name
                ? currentTrainer.first_name
                : data.update_trainer_first_name;

        let lastName =
            !data.update_trainer_last_name
                ? currentTrainer.last_name
                : data.update_trainer_last_name;

        let specialization =
            !data.update_trainer_specialization
                ? currentTrainer.specialization
                : data.update_trainer_specialization;

        let hourlyRate =
            !data.update_trainer_hourly_rate
                ? currentTrainer.hourly_rate
                : data.update_trainer_hourly_rate;

        let updateQuery = `
            UPDATE Trainers
            SET first_name = ?,
                last_name = ?,
                specialization = ?,
                hourly_rate = ?
            WHERE trainer_id = ?;
        `;

        let values = [
            firstName,
            lastName,
            specialization,
            hourlyRate,
            trainerID
        ];

        db.pool.query(updateQuery, values, function(error) {

            if (error) {
                console.log(error);
                return res.status(400).send(error);
            }

            res.redirect('/trainers');
        });
    });
});

// DELETE Trainer
app.post('/delete_trainer', function(req, res) {

    let trainerID = parseInt(req.body.delete_trainer_id);

    let query = `DELETE FROM Trainers WHERE trainer_id = ?`;

    db.pool.query(query, [trainerID], function(error) {
        if (error) {
            console.log(error);
            return res.status(400).send(error);
        } else {
            res.redirect('/trainers');
        }
    });
});

// GET Classes page
app.get('/classes', function(req, res) {
    // Display all Classes
    let query1 = `
    SELECT
        Classes.class_id,
        Classes.class_name,
        Classes.max_capacity,
        Classes.room_location,
        Trainers.first_name,
        Trainers.last_name
    FROM Classes
    LEFT JOIN Trainers
        ON Classes.trainer_id = Trainers.trainer_id;
    `;
    // Display all Trainers
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

app.post('/add-class', function(req, res) {

    let data = req.body;

    // Convert empty trainer dropdown to NULL
    let trainerID =
        data.add_class_trainer_id === ""
            ? null
            : data.add_class_trainer_id;

        // Validate required fields
    if (
        !data.add_class_title ||
        !data.add_class_max_capacity ||
        !data.add_class_room_location
    ) {
        return res.status(400).send("Missing required fields");
    }

    let query = `
        INSERT INTO Classes (class_name, max_capacity, trainer_id, room_location)
        VALUES (?, ?, ?, ?)
    `;

    let values = [
        data.add_class_title,
        data.add_class_max_capacity,
        trainerID,
        data.add_class_room_location
    ];

    db.pool.query(query, values, function(error) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/classes');
        }
    });
});

// UPDATE Class
app.post('/update_class', function(req, res) {
    let data = req.body;

    let classID = data.update_class_id;

    // Get current class data first
    let selectQuery = `
        SELECT * FROM Classes
        WHERE class_id = ?;
    `;

    db.pool.query(selectQuery, [classID], function(error, rows) {
        if (error) {
            console.log(error);
            return res.status(400).send(error);
        }

        // Class not found
        if (rows.length === 0) {
            return res.status(404).send("Class not found");
        }

        let currentClass = rows[0];

        // Keep old values if fields left blank
        let className =
            data.update_class_name.trim() === ""
                ? currentClass.class_name
                : data.update_class_name;

        let maxCapacity =
            data.update_class_max_capacity === ""
                ? currentClass.max_capacity
                : data.update_class_max_capacity;

        let roomLocation =
            data.update_class_room_location.trim() === ""
                ? currentClass.room_location
                : data.update_class_room_location;

        /*
            Trainer logic:
            - Empty string = keep current trainer
            - "null" = remove trainer assignment
            - Otherwise = new selected trainer
        */

        let trainerID;

        // Keep current trainer
        if (data.update_class_trainer_id === "") {
            trainerID = currentClass.trainer_id;
        }
         // Remove trainer assignment
        else if (data.update_class_trainer_id === "NULL") {
            trainerID = null;
        }
        else {
        // Assign selected trainer
            trainerID = data.update_class_trainer_id;
        }

        let updateQuery = `
            UPDATE Classes
            SET class_name = ?,
                max_capacity = ?,
                trainer_id = ?,
                room_location = ?
            WHERE class_id = ?;
        `;

        let values = [
            className,
            maxCapacity,
            trainerID,
            roomLocation,
            classID
        ];

        db.pool.query(updateQuery, values, function(error) {
            if (error) {
                console.log(error);
                return res.status(400).send(error);
            }

            res.redirect('/classes');
        });
    });
});

// DELETE Class
app.post('/delete_class', function(req, res) {
    let classID = parseInt(req.body.delete_class_id);

    let query = `DELETE FROM Classes WHERE class_id = ?`;

    db.pool.query(query, [classID], function(error) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/classes');
        }
    });
});

// GET Members page
app.get('/members', function(req, res) {
    // JOIN with Trainers to get names instead of raw trainer_id
    let query1 = `SELECT Members.member_id, Members.first_name, Members.last_name,
                  Members.email, Members.phone_number, Members.trainer_id, Members.membership_start_date,
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

// POST to UPDATE member
app.post('/update-member', function(req, res) {
    let data = req.body;

    // Capture new values from the form
    let memberID = parseInt(data['update-id']);
    let fname = data['update-fname'];
    let lname = data['update-lname'];
    let email = data['update-email'];
    let phone = data['update-phone'];
    let trainer = parseInt(data['update-trainer']);

    // Handle optional trainer
    if (isNaN(trainer)) {
        trainer = null;
    }

    // SQL query to update the record
    let query = `UPDATE Members
                 SET first_name = ?, last_name = ?, email = ?, phone_number = ?, trainer_id = ?
                 WHERE member_id = ?`;

    let values = [fname, lname, email, phone, trainer, memberID];

    db.pool.query(query, values, function(error, rows, fields) {
        if (error) {
            console.log("Update Error:", error);
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

    let query1 = `CALL DeleteMember(?)`;

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
            res.render('equipment_records', { equipment_records: rows });
        }
    });
});

// POST to delete equipment_records
app.post('/delete-equipment', function(req, res) {
    let equipmentID = parseInt(req.body.equipment_id);
    let query = `DELETE FROM Equipment_Records WHERE equipment_id = ?`;

    db.pool.query(query, [equipmentID], function(error) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/equipment_records');
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

// POST to UPDATE Equipment
app.post('/update-equipment', function(req, res) {
    let data = req.body;

    let equipmentID = parseInt(data['update-id']);
    let name = data['update-name'];
    let status = data['update-status'];
    let location = data['update-location'];

    let query = `UPDATE Equipment_Records
                 SET item_name = ?, maintenance_status = ?, location = ?
                 WHERE equipment_id = ?`;

    let values = [name, status, location, equipmentID];

    db.pool.query(query, values, function(error, rows, fields) {
        if (error) {
            console.log("Update Error:", error);
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
app.post('/add-class-enrollment', function(req, res)
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
app.post('/add_class_equipment', function(req, res) {
    let data = req.body;

    let query = `INSERT INTO Classes_Equipment (class_id, equipment_id) VALUES (?, ?)`;
    let values = [data['input_class'], data['input_equipment']];

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
app.post('/update_class_equipment', function(req, res) {
    let data = req.body;
    let assignmentID = data.update_id;

    // Get current assignment data first
    let selectQuery = `
        SELECT * FROM Classes_Equipment
        WHERE class_equipment_id = ?;
    `;

    db.pool.query(selectQuery, [assignmentID], function(error, rows) {
        if (error) {
            console.log(error);
            return res.status(400).send(error);
        }

        // Assignment not found
        if (rows.length === 0) {
            return res.status(404).send("Assignment not found");
        }

        let currentAssignment = rows[0];

        // Keep current values if left blank
        let classID =
            data.update_class === ""
                ? currentAssignment.class_id
                : data.update_class;

        let equipmentID =
            data.update_equipment === ""
                ? currentAssignment.equipment_id
                : data.update_equipment;

        let updateQuery = `
            UPDATE Classes_Equipment
            SET class_id = ?,
                equipment_id = ?
            WHERE class_equipment_id = ?;
        `;

        let values = [
            classID,
            equipmentID,
            assignmentID
        ];

        db.pool.query(updateQuery, values, function(error) {

            if (error) {
                console.log(error);
                return res.status(400).send(error);
            }

            res.redirect('/classes_equipment');
        });
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

// POST route to run the database reset procedure
app.post('/reset-database', function(req, res) {
    let query = "CALL ResetGymDatabase();";
    db.pool.query(query, function(error, rows, fields) {
        if (error) {
            console.log("Reset Error:", error);
            res.sendStatus(400);
        } else {
            res.redirect('/');
        }
    });
});

/*
    LISTENER
*/

app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});