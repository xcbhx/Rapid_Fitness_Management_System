-- Group 2: Eman Alturky, Ceina Ellison

SET FOREIGN_KEY_CHECKS = 0;
SET AUTOCOMMIT = 0;

DROP PROCEDURE IF EXISTS ResetGymDatabase;

DELIMITER //

CREATE PROCEDURE ResetGymDatabase()
BEGIN
    SET FOREIGN_KEY_CHECKS = 0;

    DROP TABLE IF EXISTS Enrollments;
    DROP TABLE IF EXISTS Classes_Equipment;
    DROP TABLE IF EXISTS Classes;
    DROP TABLE IF EXISTS Members;
    DROP TABLE IF EXISTS Trainers;
    DROP TABLE IF EXISTS Equipment_Records;


    CREATE TABLE Trainers (
        trainer_id INT AUTO_INCREMENT,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        specialization VARCHAR(100) NULL,
        hourly_rate DECIMAL(19,2) NOT NULL,
        PRIMARY KEY (trainer_id)
    );

    CREATE TABLE Members (
        member_id INT AUTO_INCREMENT,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone_number VARCHAR(15),
        membership_start_date DATE NOT NULL,
        trainer_id INT NULL,
        PRIMARY KEY (member_id),
        FOREIGN KEY (trainer_id) REFERENCES Trainers(trainer_id) ON DELETE SET NULL ON UPDATE CASCADE
    );

    CREATE TABLE Classes (
        class_id INT AUTO_INCREMENT,
        class_name VARCHAR(100) NOT NULL,
        max_capacity INT NOT NULL,
        trainer_id INT NULL,
        room_location VARCHAR(50) NOT NULL,
        PRIMARY KEY (class_id),
        FOREIGN KEY (trainer_id) REFERENCES Trainers(trainer_id) ON DELETE SET NULL ON UPDATE CASCADE
    );

    CREATE TABLE Equipment_Records (
        equipment_id INT AUTO_INCREMENT,
        item_name VARCHAR(100) NOT NULL,
        maintenance_status VARCHAR(50) NOT NULL,
        purchase_date DATE NULL,
        location VARCHAR(50) NOT NULL,
        PRIMARY KEY (equipment_id)
    );

    CREATE TABLE Enrollments (
        enrollment_id INT AUTO_INCREMENT,
        member_id INT NOT NULL,
        class_id INT NOT NULL,
        signup_date DATE NOT NULL,
        PRIMARY KEY (enrollment_id),
        FOREIGN KEY (member_id) REFERENCES Members(member_id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (class_id) REFERENCES Classes(class_id) ON DELETE CASCADE ON UPDATE CASCADE
    );

    CREATE TABLE Classes_Equipment (
        class_equipment_id INT AUTO_INCREMENT,
        class_id INT NOT NULL,
        equipment_id INT NOT NULL,
        UNIQUE (class_id, equipment_id),
        PRIMARY KEY (class_equipment_id),
        FOREIGN KEY (class_id) REFERENCES Classes(class_id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (equipment_id) REFERENCES Equipment_Records(equipment_id) ON DELETE CASCADE ON UPDATE CASCADE
    );

    -- Trainers Table
    INSERT INTO Trainers (trainer_id, first_name, last_name, specialization, hourly_rate)
    VALUES
    (10, 'Michael', 'Scott', 'Yoga', 50.55),
    (11, 'Pam', 'Beesly', 'HIIT', 65.25),
    (12, 'Jim', 'Halpert', 'Strength Training', 65.75);

    -- Members Table
    INSERT INTO Members (member_id, first_name, last_name, email, phone_number, membership_start_date, trainer_id)
    VALUES
    (172, 'Amy', 'Clark', 'clarka@gmail.com', '503-142-6326', '2026-01-12', 10),
    (123, 'Sara', 'Mathers', 'saramaths@gmail.com', '503-582-5682', '2026-02-10', 11),
    (421, 'John', 'Smith', 'smithj@outlook.com', '971-458-2752', '2026-03-01', 12);

    -- Classes Table
    INSERT INTO Classes (class_id, class_name, max_capacity, trainer_id, room_location)
    VALUES
    (201, 'Morning Movement', 23, 10, 'Studio A'),
    (302, 'Power Hour', 15, 11, 'Studio B'),
    (403, 'Ironman', 20, 12, 'Weights Room');

    --  Equipment_Records Table
    INSERT INTO Equipment_Records (equipment_id, item_name, maintenance_status, purchase_date, location)
    VALUES
    (501, 'Yoga Mat', 'Good', '2006-02-14', 'Storage A'),
    (502, '20LB Kettlebell', 'Needs repair', '2025-10-12', 'Weights Room'),
    (503, 'Treadmill', 'In maintenance', '2024-12-05', 'Cardio Zone');

    -- Enrollments Table (Intersection)
    INSERT INTO Enrollments (member_id, class_id, signup_date)
        VALUES
        ((SELECT member_id FROM Members WHERE email = 'clarka@gmail.com'), (SELECT class_id FROM Classes WHERE class_name = 'Morning Movement'), '2026-01-12'),
        ((SELECT member_id FROM Members WHERE email = 'clarka@gmail.com'), (SELECT class_id FROM Classes WHERE class_name = 'Power Hour'), '2026-01-15'),
        ((SELECT member_id FROM Members WHERE email = 'smithj@outlook.com'), (SELECT class_id FROM Classes WHERE class_name = 'Morning Movement'), '2026-03-01'),
        ((SELECT member_id FROM Members WHERE email = 'saramaths@gmail.com'), (SELECT class_id FROM Classes WHERE class_name = 'Ironman'), '2026-02-10');

    -- Classes_Equipment Table (Intersection)
    INSERT INTO Classes_Equipment (class_id, equipment_id)
        VALUES
        ((SELECT class_id FROM Classes WHERE class_name = 'Morning Movement'), (SELECT equipment_id FROM Equipment_Records WHERE item_name = 'Yoga Mat')),
        ((SELECT class_id FROM Classes WHERE class_name = 'Power Hour'), (SELECT equipment_id FROM Equipment_Records WHERE item_name = '20LB Kettlebell')),
        ((SELECT class_id FROM Classes WHERE class_name = 'Ironman'), (SELECT equipment_id FROM Equipment_Records WHERE item_name = 'Treadmill'));

    SET FOREIGN_KEY_CHECKS = 1;
END //

-- reset delimiter to default
DELIMITER ;

-- execute procedure so tables populate
CALL ResetGymDatabase();

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;