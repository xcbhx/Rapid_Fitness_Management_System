-- Citation for the following function:
-- Date: 05/20/2026
-- Copied from /OR/ Adapted from /OR/ Based on: Used the starter code
-- Source URL: https://canvas.oregonstate.edu/courses/2042369/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=26640205


-- CREATE Trainers
DROP PROCEDURE IF EXISTS sp_CreateTrainers;

DELIMITER //
CREATE PROCEDURE sp_CreateTrainers(
    IN first_name VARCHAR(50),
    IN last_name VARCHAR(50),
    IN specialization VARCHAR(100),
    IN hourly_rate DECIMAL(19,2)
)
BEGIN
    INSERT INTO Trainers (first_name, last_name, specialization, hourly_rate)

    VALUES (first_name, last_name, specialization, hourly_rate);

    -- Display the ID of the last inserted trainer.
    SELECT LAST_INSERT_ID() AS 'new_id';

END //
DELIMITER ;

-- UPDATE Trainers
DROP PROCEDURE IF EXISTS sp_UpdateTrainers;

DELIMITER //
CREATE PROCEDURE sp_UpdateTrainers(
    IN trainer_id_input INT,
    IN first_name VARCHAR(50),
    IN last_name VARCHAR(50),
    IN specialization VARCHAR(100),
    IN hourly_rate DECIMAL(19,2)
)

BEGIN
    UPDATE Trainers
    SET first_name = COALESCE(NULLIF(trainer_first_name, ''), first_name),
        last_name = COALESCE(NULLIF(trainer_last_name, ''), last_name),
        specialization = COALESCE(NULLIF(trainer_specialization, ''), specialization),
        hourly_rate = COALESCE(trainer_hourly_rate, hourly_rate)
    WHERE trainer_id = trainer_id_input;

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
        trainer_id = CASE WHEN p_trainer_id = -1 THEN NULL ELSE COALESCE(p_trainer_id, trainer_id) END
    WHERE member_id = p_member_id;
END //
DELIMITER ;

-- drop the delete procedure if exists
DROP PROCEDURE IF EXISTS DeleteMember;
DELIMITER //

 -- DELETE Member --
CREATE PROCEDURE DeleteMember(IN member_id_param INT)
BEGIN
    DELETE FROM Members WHERE member_id = member_id_param;
END //

DELIMITER ;

-- Procedure to DELETE trainer --
DROP PROCEDURE IF EXISTS DeleteTrainer;

DELIMITER //

CREATE PROCEDURE DeleteTrainer(IN trainer_id_param INT)
BEGIN
    DELETE FROM Trainers WHERE trainer_id = trainer_id_param;
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
DROP PROCEDURE IF EXISTS DeleteClass;
DELIMITER //
CREATE PROCEDURE DeleteClass(IN class_id_param INT)
BEGIN
    DELETE FROM Classes WHERE class_id = class_id_param;
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

-- UPDATE Classes_Equipment
DROP PROCEDURE IF EXISTS sp_UpdateClassEquipment;

DELIMITER //

CREATE PROCEDURE sp_UpdateClassEquipment(
    IN class_equipment_id INT,
    IN class_id INT,
    IN equipment_id INT
)

BEGIN

    UPDATE Classes_Equipment
    SET class_id = COALESCE(ce_class_id, class_id),
        equipment_id = COALESCE(ce_equipment_id, equipment_id)
    WHERE class_equipment_id = ce_class_equipment_id;

END //

DELIMITER ;

-- DELETE Classes_Equipment assignment
DROP PROCEDURE IF EXISTS DeleteClassEquipment;
DELIMITER //

CREATE PROCEDURE DeleteClassEquipment(IN ce_id_param INT)
BEGIN
    DELETE FROM Classes_Equipment WHERE class_equipment_id = ce_id_param;
END //

DELIMITER ;