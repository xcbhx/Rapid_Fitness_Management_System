-- Group 2: Ceina Ellison, Eman Alturky
-- Description: Original DML script containing initial sample data.

-- TRAINERS PAGE

-- SELECT: get all trainers to display in the browse table
SELECT * FROM Trainers;

-- INSERT: add a new trainer
CALL sp_CreateTrainers(:first_name_input, :last_name_input, :specialization_input, :hourly_rate_input);

-- UPDATE: edit trainer details
CALL sp_UpdateTrainers(:trainer_id_selected_from_table, :first_name_input, :last_name_input, :specialization_input, :hourly_rate_input);

-- DELETE: remove a trainer
CALL sp_DeleteTrainer(:trainer_id_selected_from_table);


-- MEMBERS PAGE


-- SELECT: get all member details with their trainers name
SELECT Members.member_id, Members.first_name, Members.last_name,
       Members.email, Members.phone_number, Members.membership_start_date,
       Trainers.first_name AS trainer_first, Trainers.last_name AS trainer_last
FROM Members
LEFT JOIN Trainers ON Members.trainer_id = Trainers.trainer_id;

-- INSERT: add a new member using variables from the web form
CALL sp_CreateMember(:first_name_input, :last_name_input, :email_input, :phone_input, :start_date_input, :trainer_id_input);

-- UPDATE: modify a member's information based on the ID selected from the table
--UPDATE Members

CALL sp_UpdateMember(:member_id_selected, :fname_input, :lname_input, :email_input, :phone_input, :trainer_id_input);

-- DELETE: remove a member from the database
CALL sp_DeleteMember(:member_id_selected_from_table);


-- CLASSES PAGE


-- SELECT: get all classes to browse
SELECT * FROM Classes;

-- INSERT: add a new fitness class
CALL sp_CreateClass(:class_name_input, :max_capacity_input, :trainer_id_input, :room_location_input);

-- UPDATE: edit class details

--UPDATE Classes
SET class_name = :class_name_input,

CALL sp_UpdateClass(:class_id_selected, :class_name_input, :max_capacity_input, :trainer_id_input, :room_location_input);

-- DELETE: cancel a class
CALL sp_DeleteClass(:class_id_selected);


-- EQUIPMENT PAGE


-- SELECT: get all equipment records for the browse table
SELECT * FROM Equipment_Records;

-- CREATE: log a new piece of equipment
CALL sp_CreateEquipment(:item_name_input, :maintenance_status_dropdown, :purchase_date_input, :location_input);

-- UPDATE: edit equipment details
CALL sp_UpdateEquipment(:equipment_id_selected, :item_name_input, :maintenance_status_dropdown, :location_input);

-- DELETE: remove an equipment record
CALL sp_DeleteEquipment(:equipment_id_selected_from_table);


-- ENROLLMENTS PAGE

-- SELECT: view which members are in which classes
SELECT Enrollments.enrollment_id, Members.first_name, Members.last_name, Classes.class_name, Enrollments.signup_date
FROM Enrollments
JOIN Members ON Enrollments.member_id = Members.member_id
JOIN Classes ON Enrollments.class_id = Classes.class_id;

-- INSERT: enroll a member in a class
CALL sp_CreateEnrollment(:member_id_from_dropdown, :class_id_from_dropdown);

-- UPDATE: change a members enrollment to a different class

CALL sp_UpdateEnrollment(:enrollment_id_selected, :member_id_from_dropdown, :class_id_from_dropdown);

-- DELETE: remove a member's enrollment
CALL sp_DeleteEnrollment(:enrollment_id_selected);

-- CLASSES_EQUIPMENT PAGE

-- SELECT: list which equipment is assigned to which class
SELECT Classes_Equipment.class_equipment_id, Classes.class_name, Equipment_Records.item_name
FROM Classes_Equipment
JOIN Classes ON Classes_Equipment.class_id = Classes.class_id
JOIN Equipment_Records ON Classes_Equipment.equipment_id = Equipment_Records.equipment_id;

-- INSERT: assign equipment to a class
CALL sp_CreateClassesEquipment(:class_id_from_dropdown, :equipment_id_from_dropdown);

-- UPDATE: change the equipment assigned to a class
CALL sp_UpdateClassesEquipment(:class_equipment_id_selected_from_table, :class_id_from_dropdown, :equipment_id_from_dropdown);

-- DELETE: remove an equipment assignment from a class

CALL sp_DeleteClassEquipment(:class_equipment_id_selected);