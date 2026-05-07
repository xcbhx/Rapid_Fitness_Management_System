/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.5.29-MariaDB, for Linux (x86_64)
--
-- Host: classmysql.engr.oregonstate.edu    Database: cs340_ellisoce
-- ------------------------------------------------------
-- Server version	10.11.16-MariaDB-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Classes`
--

DROP TABLE IF EXISTS `Classes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Classes` (
  `class_id` int(11) NOT NULL AUTO_INCREMENT,
  `class_name` varchar(100) NOT NULL,
  `max_capacity` int(11) NOT NULL,
  `trainer_id` int(11) NOT NULL,
  `room_location` varchar(50) NOT NULL,
  PRIMARY KEY (`class_id`),
  KEY `trainer_id` (`trainer_id`),
  CONSTRAINT `Classes_ibfk_1` FOREIGN KEY (`trainer_id`) REFERENCES `Trainers` (`trainer_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=404 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Classes`
--

LOCK TABLES `Classes` WRITE;
/*!40000 ALTER TABLE `Classes` DISABLE KEYS */;
INSERT INTO `Classes` VALUES (201,'Morning Movement',23,10,'Studio A'),(302,'Power Hour',15,11,'Studio B'),(403,'Ironman',20,12,'Weights Room');
/*!40000 ALTER TABLE `Classes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Classes_Equipment`
--

DROP TABLE IF EXISTS `Classes_Equipment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Classes_Equipment` (
  `class_id` int(11) NOT NULL,
  `equipment_id` int(11) NOT NULL,
  PRIMARY KEY (`class_id`,`equipment_id`),
  KEY `equipment_id` (`equipment_id`),
  CONSTRAINT `Classes_Equipment_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `Classes` (`class_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Classes_Equipment_ibfk_2` FOREIGN KEY (`equipment_id`) REFERENCES `Equipment_Records` (`equipment_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Classes_Equipment`
--

LOCK TABLES `Classes_Equipment` WRITE;
/*!40000 ALTER TABLE `Classes_Equipment` DISABLE KEYS */;
INSERT INTO `Classes_Equipment` VALUES (201,501),(302,502),(403,503);
/*!40000 ALTER TABLE `Classes_Equipment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Enrollments`
--

DROP TABLE IF EXISTS `Enrollments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Enrollments` (
  `enrollment_id` int(11) NOT NULL AUTO_INCREMENT,
  `member_id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  `signup_date` date NOT NULL,
  PRIMARY KEY (`enrollment_id`),
  KEY `member_id` (`member_id`),
  KEY `class_id` (`class_id`),
  CONSTRAINT `Enrollments_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `Members` (`member_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Enrollments_ibfk_2` FOREIGN KEY (`class_id`) REFERENCES `Classes` (`class_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=104 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Enrollments`
--

LOCK TABLES `Enrollments` WRITE;
/*!40000 ALTER TABLE `Enrollments` DISABLE KEYS */;
INSERT INTO `Enrollments` VALUES (101,172,201,'2026-01-12'),(102,421,302,'2026-03-01'),(103,123,403,'2026-02-10');
/*!40000 ALTER TABLE `Enrollments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Equipment_Records`
--

DROP TABLE IF EXISTS `Equipment_Records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Equipment_Records` (
  `equipment_id` int(11) NOT NULL AUTO_INCREMENT,
  `item_name` varchar(100) NOT NULL,
  `maintenance_status` varchar(50) NOT NULL,
  `purchase_date` date DEFAULT NULL,
  `location` varchar(50) NOT NULL,
  PRIMARY KEY (`equipment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=504 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Equipment_Records`
--

LOCK TABLES `Equipment_Records` WRITE;
/*!40000 ALTER TABLE `Equipment_Records` DISABLE KEYS */;
INSERT INTO `Equipment_Records` VALUES (501,'Yoga Mat','Good','2006-02-14','Storage A'),(502,'20LB Kettlebell','Needs repair','2025-10-12','Weights Room'),(503,'Treadmill','In maintenance','2024-12-05','Cardio Zone');
/*!40000 ALTER TABLE `Equipment_Records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Members`
--

DROP TABLE IF EXISTS `Members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Members` (
  `member_id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  `membership_start_date` date NOT NULL,
  `trainer_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`member_id`),
  UNIQUE KEY `email` (`email`),
  KEY `trainer_id` (`trainer_id`),
  CONSTRAINT `Members_ibfk_1` FOREIGN KEY (`trainer_id`) REFERENCES `Trainers` (`trainer_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=422 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Members`
--

LOCK TABLES `Members` WRITE;
/*!40000 ALTER TABLE `Members` DISABLE KEYS */;
INSERT INTO `Members` VALUES (123,'Sara','Mathers','saramaths@gmail.com','503-582-5682','2026-02-10',11),(172,'Amy','Clark','clarka@gmail.com','503-142-6326','2026-01-12',10),(421,'John','Smith','smithj@outlook.com','971-458-2752','2026-03-01',12);
/*!40000 ALTER TABLE `Members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Trainers`
--

DROP TABLE IF EXISTS `Trainers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Trainers` (
  `trainer_id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `specialization` varchar(100) DEFAULT NULL,
  `hourly_rate` decimal(19,2) NOT NULL,
  PRIMARY KEY (`trainer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Trainers`
--

LOCK TABLES `Trainers` WRITE;
/*!40000 ALTER TABLE `Trainers` DISABLE KEYS */;
INSERT INTO `Trainers` VALUES (10,'Michael','Scott','Yoga',50.55),(11,'Pam','Beesly','HIIT',65.25),(12,'Jim','Halpert','Strength Training',65.75);
/*!40000 ALTER TABLE `Trainers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `diagnostic`
--

DROP TABLE IF EXISTS `diagnostic`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `diagnostic` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `text` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `diagnostic`
--

LOCK TABLES `diagnostic` WRITE;
/*!40000 ALTER TABLE `diagnostic` DISABLE KEYS */;
INSERT INTO `diagnostic` VALUES (1,'Testing');
/*!40000 ALTER TABLE `diagnostic` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-07 12:47:02
