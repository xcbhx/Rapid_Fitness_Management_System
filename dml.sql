-- Group 2: Ceina Ellison, Eman Alturky

------
-- TRAINERS PAGE
------
-- SELECT: get all trainers to display in the browse table
SELECT * FROM Trainers;

-- INSERT: add a new trainer
INSERT INTO Trainers (first_name, last_name, specialization, hourly_rate)
VALUES (:first_name_input, :last_name_input, :specialization_input, :hourly_rate_input);

-- UPDATE: edit trainer details
UPDATE Trainers
SET first_name = :first_name_input,
    last_name = :last_name_input,
    specialization = :specialization_input,
    hourly_rate = :hourly_rate_input
WHERE trainer_id = :trainer_id_selected_from_table;

-- DELETE: remove a trainer
DELETE FROM Trainers WHERE trainer_id = :trainer_id_selected_from_table;

-----
-- MEMBERS PAGE
-----

-- SELECT: get all member details with their trainers name
SELECT Members.member_id, Members.first_name, Members.last_name,
       Members.email, Members.phone_number, Members.membership_start_date,
       Trainers.first_name AS trainer_first, Trainers.last_name AS trainer_last
FROM Members
LEFT JOIN Trainers ON Members.trainer_id = Trainers.trainer_id;

-- INSERT: add a new member using variables from the web form
INSERT INTO Members (first_name, last_name, email, phone_number, membership_start_date, trainer_id)
VALUES (:first_name_input, :last_name_input, :email_input, :phone_input, :start_date_input, :trainer_id_from_dropdown);

-- UPDATE: modify a member's information based on the ID selected from the table
UPDATE Members
SET first_name = :first_name_input,
    last_name = :last_name_input,
    email = :email_input,
    phone_number = :phone_input,
    membership_start_date = :start_date_input,
    trainer_id = :trainer_id_from_dropdown
WHERE member_id = :member_id_selected_from_table;

-- DELETE: remove a member from the database
-- (original query kept for reference)
-- DELETE FROM Members WHERE member_id = :member_id_selected_from_table;

-----
-- CLASSES PAGE
-----

-- SELECT: get all classes to browse
SELECT * FROM Classes;

-- INSERT: add a new fitness class
INSERT INTO Classes (class_name, max_capacity, trainer_id, room_location)
VALUES (:class_name_input, :max_capacity_input, :trainer_id_from_dropdown, :room_location_input);

-- UPDATE: edit class details
UPDATE Classes
SET class_name = :class_name_input,
    max_capacity = :max_capacity_input,
    trainer_id = :trainer_id_from_dropdown,
    room_location = :room_location_input
WHERE class_id = :class_id_selected;

-- DELETE: cancel a class
DELETE FROM Classes WHERE class_id = :class_id_selected;

-----
-- EQUIPMENT PAGE
-----

-- SELECT: get all equipment records for the browse table
SELECT * FROM Equipment_Records;

-- CREATE: log a new piece of equipment
INSERT INTO Equipment_Records (item_name, maintenance_status, purchase_date, location)
VALUES (:item_name_input, :maintenance_status_input, :purchase_date_input, :location_input);

-- UPDATE: edit equipment details
UPDATE Equipment_Records
SET item_name = :item_name_input,
    maintenance_status = :maintenance_status_input,
    purchase_date = :purchase_date_input,
    location = :location_input
WHERE equipment_id = :equipment_id_selected_from_table;

-- DELETE: remove an equipment record
DELETE FROM Equipment_Records WHERE equipment_id = :equipment_id_selected_from_table;

-----
-- ENROLLMENTS PAGE
-----
-- SELECT: view which members are in which classes
SELECT Enrollments.enrollment_id, Members.first_name, Members.last_name, Classes.class_name, Enrollments.signup_date
FROM Enrollments
JOIN Members ON Enrollments.member_id = Members.member_id
JOIN Classes ON Enrollments.class_id = Classes.class_id;

-- INSERT: enroll a member in a class
INSERT INTO Enrollments (member_id, class_id, signup_date)
VALUES (:member_id_from_dropdown, :class_id_from_dropdown, :signup_date_input);

-- UPDATE: change a members enrollment to a different class
UPDATE Enrollments
SET member_id = :member_id_from_dropdown,
    class_id = :class_id_from_dropdown,
    signup_date = :signup_date_input

WHERE enrollment_id = :enrollment_id_selected_from_table;

-- DELETE: remove a member's enrollment
DELETE FROM Enrollments WHERE enrollment_id = :enrollment_id_selected;

-----
-- CLASSES_EQUIPMENT PAGE
-----

-- SELECT: list which equipment is assigned to which class
SELECT Classes_Equipment.class_equipment_id, Classes.class_name, Equipment_Records.item_name
FROM Classes_Equipment
JOIN Classes ON Classes_Equipment.class_id = Classes.class_id
JOIN Equipment_Records ON Classes_Equipment.equipment_id = Equipment_Records.equipment_id;

-- INSERT: assign equipment to a class
INSERT INTO Classes_Equipment (class_id, equipment_id)
VALUES (:class_id_from_dropdown, :equipment_id_from_dropdown);

-- UPDATE: change the equipment assigned to a class
UPDATE Classes_Equipment
SET class_id = :class_id_from_dropdown,
    equipment_id = :equipment_id_from_dropdown
WHERE class_equipment_id = :class_equipment_id_selected_from_table;

-- DELETE: remove an equipment assignment from a class
DELETE FROM Classes_Equipment
WHERE class_equipment_id = :class_equipment_id_selected;