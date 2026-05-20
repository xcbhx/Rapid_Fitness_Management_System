-- Citation for the following function:
-- Date: 05/20/2026
-- Copied from /OR/ Adapted from /OR/ Based on: Used the starter code
-- Source URL: https://canvas.oregonstate.edu/courses/2042369/pages/exploration-implementing-cud-operations-in-your-app?module_item_id=26640205


-- #############################
-- CREATE Trainers
-- #############################
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
DROP PROCEDURE IF EXISTS DeleteTrainer //

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