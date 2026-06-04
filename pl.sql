-- Citation for the following function:
-- Date: 05/20/2026
-- Copied from /OR/ Adapted from /OR/ Based on: Used the starter code
-- Source URL: https://canvas.oregonstate.edu/courses/2042369/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=26640205

-- Citation for use of AI tools:
-- Date: 06/01/2026
-- Prompts used to help with parameter collisions and empty input string handling
-- why does leaving a web form input blank end up wiping out or clearing existing table data during an update
-- and how can we design a stored procedure that can isolate and update data
-- AI Source URL: https://copilot.microsoft.com/


-- CREATE Trainers
DROP PROCEDURE IF EXISTS sp_CreateTrainers;

DELIMITER //
CREATE PROCEDURE sp_CreateTrainers(
    IN p_fname VARCHAR(50),
    IN p_lname VARCHAR(50),
    IN p_specialization VARCHAR(100),
    IN p_hourly_rate DECIMAL(19,2)
)
BEGIN
    INSERT INTO Trainers (
        first_name,
        last_name,
        specialization,
        hourly_rate
    )
    VALUES (p_fname, p_lname, p_specialization, p_hourly_rate);

    -- Display the ID of the last inserted trainer.
    SELECT LAST_INSERT_ID() AS 'new_id';

END //
DELIMITER ;

-- UPDATE Trainers
DROP PROCEDURE IF EXISTS sp_UpdateTrainers;

DELIMITER //
CREATE PROCEDURE sp_UpdateTrainers(
    IN p_trainer_id INT,
    IN p_fname VARCHAR(50),
    IN p_lname VARCHAR(50),
    IN p_specialization VARCHAR(100),
    IN p_hourly_rate DECIMAL(19,2)
)

BEGIN
    UPDATE Trainers
    SET first_name = COALESCE(NULLIF(p_fname, ''), first_name),
        last_name = COALESCE(NULLIF(p_lname, ''), last_name),
        specialization = COALESCE(NULLIF(p_specialization, ''), specialization),
        hourly_rate = COALESCE(p_hourly_rate, hourly_rate)
    WHERE trainer_id = p_trainer_id;

END //
DELIMITER ;

-- Procedure to DELETE trainer --
DROP PROCEDURE IF EXISTS sp_DeleteTrainer;

DELIMITER //

CREATE PROCEDURE sp_DeleteTrainer(IN trainer_id_param INT)
BEGIN
    DELETE FROM Trainers WHERE trainer_id = trainer_id_param;
END //

DELIMITER ;

-- CREATE Member
DROP PROCEDURE IF EXISTS sp_CreateMember;
DELIMITER //

CREATE PROCEDURE sp_CreateMember(
    IN p_fname VARCHAR(50),
    IN p_lname VARCHAR(50),
    IN p_email VARCHAR(100),
    IN p_phone VARCHAR(15),
    IN p_start_date DATE,
    IN p_trainer_id INT
)
BEGIN
    INSERT INTO Members (first_name, last_name, email, phone_number, membership_start_date, trainer_id)
    VALUES (p_fname, p_lname, p_email, p_phone, p_start_date, NULLIF(p_trainer_id, 0));
END //
DELIMITER ;

-- UPDATE Member
DROP PROCEDURE IF EXISTS sp_UpdateMember;
DELIMITER //
CREATE PROCEDURE sp_UpdateMember(
    IN p_member_id INT,
    IN p_fname VARCHAR(50),
    IN p_lname VARCHAR(50),
    IN p_email VARCHAR(100),
    IN p_phone VARCHAR(15),
    IN p_trainer_id INT
)
BEGIN
    UPDATE Members
    SET first_name = COALESCE(NULLIF(p_fname, ''), first_name),
        last_name = COALESCE(NULLIF(p_lname, ''), last_name),
        email = COALESCE(NULLIF(p_email, ''), email),
        phone_number = COALESCE(NULLIF(p_phone, ''), phone_number),
        trainer_id = CASE
            WHEN p_trainer_id = -1 THEN NULL
            WHEN p_trainer_id IS NULL THEN trainer_id
            ELSE p_trainer_id
        END
    WHERE member_id = p_member_id;
END //
DELIMITER ;

-- drop the delete procedure if exists
DROP PROCEDURE IF EXISTS sp_DeleteMember;
DELIMITER //

 -- DELETE Member --
CREATE PROCEDURE sp_DeleteMember(IN member_id_param INT)
BEGIN
    DELETE FROM Members WHERE member_id = member_id_param;
END //

DELIMITER ;

-- CREATE Enrollment
DROP PROCEDURE IF EXISTS sp_CreateEnrollment;
DELIMITER //
CREATE PROCEDURE sp_CreateEnrollment(
    IN p_member_id INT,
    IN p_class_id INT
)
BEGIN
    INSERT INTO Enrollments (member_id, class_id, signup_date)
    VALUES (p_member_id, p_class_id, CURRENT_DATE());
END //
DELIMITER ;

-- UPDATE Enrollment
DROP PROCEDURE IF EXISTS sp_UpdateEnrollment;
DELIMITER //
CREATE PROCEDURE sp_UpdateEnrollment(
    IN p_enrollment_id INT,
    IN p_member_id INT,
    IN p_class_id INT
)
BEGIN
    UPDATE Enrollments
    SET member_id = COALESCE(p_member_id, member_id),
        class_id = COALESCE(p_class_id, class_id)
    WHERE enrollment_id = p_enrollment_id;
END //
DELIMITER ;

-- Procedure to DELETE enrollment
DROP PROCEDURE IF EXISTS DeleteEnrollment;
DELIMITER //

CREATE PROCEDURE DeleteEnrollment(IN enrollment_id_param INT)
BEGIN
    DELETE FROM Enrollments WHERE enrollment_id = enrollment_id_param;
END //

DELIMITER ;

-- CREATE Class
DROP PROCEDURE IF EXISTS sp_CreateClass;
DELIMITER //
CREATE PROCEDURE sp_CreateClass(
    IN p_name VARCHAR(100),
    IN p_max_capacity INT,
    IN p_trainer_id INT,
    IN p_room VARCHAR(50)
)
BEGIN
    INSERT INTO Classes (class_name, max_capacity, trainer_id, room_location)
    VALUES (p_name, p_max_capacity, NULLIF(p_trainer_id, 0), p_room);
END //
DELIMITER ;

-- UPDATE Class
DROP PROCEDURE IF EXISTS sp_UpdateClass;
DELIMITER //
CREATE PROCEDURE sp_UpdateClass(
    IN p_class_id INT,
    IN p_name VARCHAR(100),
    IN p_max_capacity INT,
    IN p_trainer_id INT,
    IN p_room VARCHAR(50)
)
BEGIN
    UPDATE Classes
    SET class_name = COALESCE(NULLIF(p_name, ''), class_name),
        max_capacity = COALESCE(p_max_capacity, max_capacity),
        trainer_id = CASE WHEN p_trainer_id = -1 THEN NULL ELSE COALESCE(p_trainer_id, trainer_id) END,
        room_location = COALESCE(NULLIF(p_room, ''), room_location)
    WHERE class_id = p_class_id;
END //
DELIMITER ;

-- Delete Class
DROP PROCEDURE IF EXISTS sp_DeleteClass;
DELIMITER //
CREATE PROCEDURE sp_DeleteClass(IN class_id_param INT)
BEGIN
    DELETE FROM Classes WHERE class_id = class_id_param;
END //
DELIMITER ;

-- CREATE Equipment Record
DROP PROCEDURE IF EXISTS sp_CreateEquipment;
DELIMITER //
CREATE PROCEDURE sp_CreateEquipment(
    IN p_item_name VARCHAR(100),
    IN p_maintenance_status VARCHAR(50),
    IN p_purchase_date DATE,
    IN p_location VARCHAR(50)
)
BEGIN
    INSERT INTO Equipment_Records (item_name, maintenance_status, purchase_date, location)
    VALUES (p_item_name, p_maintenance_status, p_purchase_date, p_location);
END //
DELIMITER ;

-- UPDATE Equipment Record
DROP PROCEDURE IF EXISTS sp_UpdateEquipment;
DELIMITER //
CREATE PROCEDURE sp_UpdateEquipment(
    IN input_equipment_id INT,
    IN input_item_name VARCHAR(100),
    IN input_maintenance_status VARCHAR(50),
    IN input_location VARCHAR(50)
)
BEGIN
    UPDATE Equipment_Records
    SET
        -- If user typed nothing or left it blank, keep the old item_name
        item_name = CASE
            WHEN input_item_name IS NULL OR input_item_name = '' THEN item_name
            ELSE input_item_name
        END,

        -- If the dropdown wasnt selected, keep the old status
        maintenance_status = CASE
            WHEN input_maintenance_status IS NULL OR input_maintenance_status = '' THEN maintenance_status
            ELSE input_maintenance_status
        END,

        -- If user left the location textbox blank, keep the old location
        location = CASE
            WHEN input_location IS NULL OR input_location = '' THEN location
            ELSE input_location
        END
    WHERE equipment_id = input_equipment_id;
END //
DELIMITER ;

-- Delete Equipment_Records
DROP PROCEDURE IF EXISTS DeleteEquipment;
DELIMITER //
CREATE PROCEDURE DeleteEquipment(IN equipment_id_param INT)
BEGIN
    DELETE FROM Equipment_Records WHERE equipment_id = equipment_id_param;
END //
DELIMITER ;

-- CREATE Classes_Equipment
DROP PROCEDURE IF EXISTS sp_CreateClassesEquipment;

DELIMITER //

CREATE PROCEDURE sp_CreateClassesEquipment(
    IN p_class_id INT,
    IN p_equipment_id INT
)

BEGIN
    INSERT INTO Classes_Equipment (class_id, equipment_id)
    VALUES (p_class_id, p_equipment_id);

END //
DELIMITER ;


-- UPDATE Classes_Equipment
DROP PROCEDURE IF EXISTS sp_UpdateClassesEquipment;

DELIMITER //

CREATE PROCEDURE sp_UpdateClassesEquipment(
    IN p_class_equipment_id INT,
    IN p_class_id INT,
    IN p_equipment_id INT
)

BEGIN
    UPDATE Classes_Equipment
    SET class_id = COALESCE(p_class_id, class_id),
        equipment_id = COALESCE(p_equipment_id, equipment_id)
    WHERE class_equipment_id = p_class_equipment_id;

END //
DELIMITER ;

-- DELETE Classes_Equipment assignment
DROP PROCEDURE IF EXISTS sp_DeleteClassesEquipment;
DELIMITER //

CREATE PROCEDURE sp_DeleteClassesEquipment(IN ce_id_param INT)
BEGIN
    DELETE FROM Classes_Equipment WHERE class_equipment_id = ce_id_param;
END //

DELIMITER ;