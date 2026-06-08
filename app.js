// Group 2: Ceina Ellison, Eman Alturky
// Description: Express server application that manages page routing, form handling,
// database interactions, and CRUD operations for all entities in the
// Rapid Fitness Management System.

// Citation for the following function:
// Date: 05/07/2026
// Copied from /OR/ Adapted from /OR/ Based on: Used the starter code
// Source URL: https://canvas.oregonstate.edu/courses/2042369/assignments/10464646

// Citation for the following function:
// Date: 05/20/2026
// Copied from /OR/ Adapted from /OR/ Based on: Used the starter code
// Source URL: https://canvas.oregonstate.edu/courses/2042369/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=26640205

// Citation for use of AI Tools:
// Date: 05/20/2026
// Prompts used to generate PL/SQL:
// With the provided stored procedure and app.js create route, does the
// implementation correctly handle user input, null values, and ensure secure insertion of trainer data?
// AI Source URL: https://copilot.microsoft.com/

// Citation for use of AI tools:
// Date: 06/01/2026
// Prompts used to help with parameter collisions and empty input string handling
// why does leaving a web form input blank end up wiping out or clearing existing table data during an update
// and how can we design a stored procedure that can isolate and update data
// AI Source URL: https://copilot.microsoft.com/

// Citation for use of AI tools:
// Date: 06/04/2026
// Prompts used to help with Enrollments partial update and NaN parameter collisions:
// how can I modify the app.post route to prevent 'NaN' errors when passing null values to stored procedures?
// and how can I ensure partial updates for Enrollments maintain existing values using COALESCE?
// AI Source URL: https://copilot.microsoft.com/

/*
    SETUP
*/

// Express
require('dotenv').config();
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
        res.render('home', {
            homePage: true
        }); // Render the home.hbs file

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
            res.render('trainers', {
                trainers: rows,
                trainersPage: true
            });
        }
    });
});


// CREATE Trainers Route
app.post('/trainers/create', async function (req, res) {
    try {
        // Parse frontend form information
        let data = req.body;

        // Validate input before DB call
        if (!data.create_trainer_first_name?.trim() ||
            !data.create_trainer_last_name?.trim()) {
            return res.status(400).send("First and last name are required");
        }

        if (!data.create_trainer_specialization)
            data.create_trainer_specialization = null;

        if (isNaN(parseFloat(data.create_trainer_hourly_rate)))
            return res.status(400).send('Invalid hourly rate');

        // Using parameterized queries (Prevents SQL injection attacks)
        const [results] = await db.pool.promise().query(
            `CALL sp_CreateTrainers(?, ?, ?, ?)`,
            [
                data.create_trainer_first_name,
                data.create_trainer_last_name,
                data.create_trainer_specialization,
                data.create_trainer_hourly_rate,
            ]
        );

        const newId = results[0][0].new_id;

        console.log(`Inserted trainer ID: ${newId}`);

        // Redirect the user to the updated webpage
        res.redirect('/trainers');
    } catch (error) {
        console.error('Error executing queries:', error);
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

// UPDATE Trainers route
app.post('/trainers/update', async function(req, res) {
    try {
        let data = req.body;
        console.log(req.body);

        // Convert invalid hourly rate to NULL
        if (isNaN(parseFloat(data.update_trainer_hourly_rate))) {
            data.update_trainer_hourly_rate = null;
        }

        if (!data.update_trainer_specialization) {
            data.update_trainer_specialization = '';
        }

        let query = `
            CALL sp_UpdateTrainers(?, ?, ?, ?, ?);
        `;

        let values = [
            data.update_trainer_id,
            data.update_trainer_first_name,
            data.update_trainer_last_name,
            data.update_trainer_specialization,
            data.update_trainer_hourly_rate
        ];

        await db.pool.promise().query(query, values);

        res.redirect('/trainers');

    } catch (error) {
        console.log(error);
        res.status(500).send('Error updating trainer');
    }
});

// POST to delete trainers
app.post('/delete-trainer', function(req, res) {
    let data = req.body;
    let trainerID = parseInt(data['trainer_id']);
    let query = `CALL sp_DeleteTrainer(?)`;

    db.pool.query(query, [trainerID], function(error, rows, fields) {
        if (error) {
            console.log("Delete Trainer Error:", error);
            res.sendStatus(400);
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
                trainers: trainers,
                classesPage: true
            });
        });
    });
});

// CREATE Classes Route
app.post('/classes/create', async function(req, res) {
    try {
        let data = req.body;
        let query = `CALL sp_CreateClass(?, ?, ?, ?)`;
        let values = [
            data.create_class_name,
            data.create_max_capacity,
            data.create_trainer_id,
            data.create_room_location
        ];

        await db.pool.promise().query(query, values);

        res.redirect('/classes');

    } catch (error) {
        console.error('Error executing queries:', error);
        res.status(500).send(
            'An error occurred while creating a class.'
        );
    }
});

// POST route to Update Class
app.post('/classes/update', async function(req, res) {
    try {
        let data = req.body;

        let maxCapacity =
            data.update_class_max_capacity === ''
                ? null
                : data.update_class_max_capacity;

        let trainerId =
            data.update_class_trainer_id === ''
                ? null
                : data.update_class_trainer_id;

        let query = "CALL sp_UpdateClass(?, ?, ?, ?, ?)";
        let values = [
            data.update_class_id,
            data.update_class_name,
            maxCapacity,
            trainerId,
            data.update_room_location
        ];

        await db.pool.promise().query(query, values);

        res.redirect('/classes');

    } catch (error) {
        console.log(error);
        res.status(500).send('Error updating class');
    }
});

// POST to delete Class
app.post('/delete-class', function(req, res) {
    let data = req.body;
    let classID = parseInt(data['class_id']);
    let query = `CALL sp_DeleteClass(?)`;

    db.pool.query(query, [classID], function(error, rows, fields) {
        if (error) {
            console.log("Delete Class Error:", error);
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
            res.render('members', {
                members: members,
                trainers: trainers,
                membersPage: true
            });
        });
    });
});

// POST members page
app.post('/add-member', function(req, res) {
    try {
        let data = req.body;
        let query = "CALL sp_CreateMember(?, ?, ?, ?, ?, ?)";
        let values = [
            data['input-fname'],
            data['input-lname'],
            data['input-email'],
            data['input-phone'],
            data['input-start-date'],
            data['input-trainer']
        ];

        db.pool.query(query, values, function(error, rows, fields) {
            if (error) { console.log(error); res.sendStatus(400); }
            else { res.redirect('/members'); }
        });
    } catch (err) { res.sendStatus(500); }
});

// POST to UPDATE member
app.post('/update-member', async function(req, res) {
    try {
        let data = req.body;

        let memberID = parseInt(data['update-id']);
        let fname = data['update-fname'] || '';
        let lname = data['update-lname'] || '';
        let email = data['update-email'] || '';
        let phone = data['update-phone'] || '';

        let trainerID = null; // Defaults to null (keep current)
        if (data['update-trainer'] === '-1') {
            trainerID = -1;
        } else if (data['update-trainer'] && data['update-trainer'] !== '') {
            trainerID = parseInt(data['update-trainer']); // specific new trainer
        }

        let query = `CALL sp_UpdateMember(?, ?, ?, ?, ?, ?)`;
        let values = [memberID, fname, lname, email, phone, trainerID];

        await db.pool.promise().query(query, values);
        res.redirect('/members');
    } catch (error) {
        console.log("Update Member Error:", error);
        res.status(500).send("Error updating member");
    }
});

// POST route to delete member
app.post('/delete-member', function(req, res) {
    let data = req.body;
    let memberID = parseInt(data['member_id']);

    let query1 = `CALL sp_DeleteMember(?)`;

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
            res.render('equipment_records', {
                equipment_records: rows,
                equipmentRecordsPage: true
            });
        }
    });
});

// POST route to add equipment record
app.post('/add-equipment', function(req, res) {
    let data = req.body;

    let query = `CALL sp_CreateEquipment(?, ?, ?, ?)`;
    let values = [
        data['item_name'],
        data['maintenance_status'],
        data['purchase_date'],
        data['location']
    ];

    db.pool.query(query, values, function(error, rows, fields) {
        if (error) {
            console.log("Add Equipment Error:", error);
            res.sendStatus(400);
        } else {
            res.redirect('/equipment_records');
        }
    });
});

// POST route to update equipment record
app.post('/update-equipment', function(req, res) {
    let data = req.body;

    let query = `CALL sp_UpdateEquipment(?, ?, ?, ?)`;
    let values = [
        parseInt(data['update-id']),
        data['update-name'],       // Sends '' if blank
        data['update-status'],     // Sends dropdown selection
        data['update-location']    // Sends '' if blank
    ];

    // 2. Execute the procedure call
    db.pool.query(query, values, function(error, rows, fields) {
        if (error) {
            console.log("Update Equipment Error:", error);
            res.sendStatus(400);
        } else {
            res.redirect('/equipment_records');
        }
    });
});

// POST to delete equipment_records
app.post('/delete-equipment', function(req, res) {
    let data = req.body;
    let equipID = parseInt(data['equipment_id']);
    let query = `CALL sp_DeleteEquipment(?)`;

    db.pool.query(query, [equipID], function(error, rows, fields) {
        if (error) {
            console.log("Delete Equipment Error:", error);
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
                    classes: classes,
                    enrollmentsPage: true
                });
            });
        });
    });
});

// POST add enrollment
app.post('/add-enrollment', function(req, res) {
    let data = req.body;

    let query = `CALL sp_CreateEnrollment(?, ?)`;
    let values = [
        parseInt(data['input-member']),
        parseInt(data['input-class']),
    ];

    db.pool.query(query, values, function(error, rows, fields) {
        if (error) {
            console.log("Add Enrollment Error:", error);
            res.sendStatus(400);
        } else {
            res.redirect('/enrollments');
        }
    });
});

// POST UPDATE Enrollment
app.post('/update-enrollment', async function(req, res) {
    try {
        let data = req.body;

        let enrollmentID = parseInt(data['update-id']);

        let memberID = (data['update-member'] && !isNaN(parseInt(data['update-member'])))
                        ? parseInt(data['update-member'])
                        : null;

        let classID = (data['update-class'] && !isNaN(parseInt(data['update-class'])))
                        ? parseInt(data['update-class'])
                        : null;

        if (isNaN(enrollmentID)) {
            throw new Error("Invalid Enrollment ID");
        }

        let query = `CALL sp_UpdateEnrollment(?, ?, ?)`;
        let values = [enrollmentID, memberID, classID];

        await db.pool.promise().query(query, values);
        res.redirect('/enrollments');
    } catch (error) {
        console.log("Update Enrollment Error:", error);
        res.status(500).send("Error updating enrollment: " + error.message);
    }
});

// POST route to delete an enrollment
app.post('/delete-enrollment', function(req, res) {
    let data = req.body;
    let enrollmentID = parseInt(data['enrollment_id']);

    let query = `CALL sp_DeleteEnrollment(?)`;

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
                    equipment_records: equipmentRows, // sends equipment dropdown data
                    classesEquipmentPage: true
                });
            });
        });
    });
});

// CREATE Classes_Equipment
app.post('/classes_equipment/create', async function(req, res) {
    try {
        let data = req.body;

        let query = `CALL sp_CreateClassesEquipment(?, ?)`;
        let values = [
            data.input_class,
            data.input_equipment
        ];

        await db.pool.promise().query(query, values);

        console.log(`Created assignment: Class ${data.input_class} -> Equipment ${data.input_equipment}`);

        res.redirect('/classes_equipment');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error creating class equipment assignment');
    }
});

// UPDATE Classes_Equipment
app.post('/classes_equipment/update', async function(req, res) {
    try {

        let data = req.body;

        // Convert blank dropdowns to NULL
        if (isNaN(parseInt(data.update_class))) {
            data.update_class = null;
        }

        if (isNaN(parseInt(data.update_equipment))) {
            data.update_equipment = null;
        }

        let query = `
            CALL sp_UpdateClassesEquipment(?, ?, ?);
        `;

        let values = [
            data.update_id,
            data.update_class,
            data.update_equipment
        ];

        await db.pool.promise().query(query, values);

        console.log(
            `Updated assignment ID: ${data.update_id}`
        );

        res.redirect('/classes_equipment');

    } catch (error) {
        console.log(error);
        res.status(500).send(
            'Error updating class equipment assignment'
        );
    }
});

// POST  to delete Class Equipment
app.post('/delete-class-equipment', function(req, res) {
    let data = req.body;
    let ceID = parseInt(data['class_equipment_id']);
    let query = `CALL sp_DeleteClassesEquipment(?)`;

    db.pool.query(query, [ceID], function(error, rows, fields) {
        if (error) {
            console.log("Delete Class Equipment Error:", error);
            res.sendStatus(400);
        } else {
            res.redirect('/classes_equipment');
        }
    });
});

// POST route to run the database reset procedure
app.post('/reset-database', function(req, res) {
    try {
        let query = "CALL ResetGymDatabase();";
        db.pool.query(query, function(error, rows, fields) {
            if (error) {
                console.error(error);
                res.status(500).send("Database Error");
            } else {
                res.redirect('/');
            }
        });
    } catch (jsError) {
        console.error(jsError);
        res.status(500).send("Server Error");
    }
});


/*
    LISTENER
*/

app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});