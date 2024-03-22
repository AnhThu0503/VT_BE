-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: soctrangspecial
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.28-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `hinhanh`
--

DROP TABLE IF EXISTS `hinhanh`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hinhanh` (
  `HA_id` int(11) NOT NULL AUTO_INCREMENT,
  `SP_id` int(11) DEFAULT NULL,
  `HA_URL` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`HA_id`),
  KEY `SP_id` (`SP_id`),
  CONSTRAINT `hinhanh_ibfk_1` FOREIGN KEY (`SP_id`) REFERENCES `sanpham` (`SP_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hinhanh`
--

LOCK TABLES `hinhanh` WRITE;
/*!40000 ALTER TABLE `hinhanh` DISABLE KEYS */;
INSERT INTO `hinhanh` VALUES (1,2,'http://res.cloudinary.com/dptlnmlvx/image/upload/v1710649733/tzmtz3ucvjockd9e6w62.jpg'),(2,2,'http://res.cloudinary.com/dptlnmlvx/image/upload/v1710649735/iem83uaslawlfm0fpbvr.jpg'),(13,6,'http://res.cloudinary.com/dptlnmlvx/image/upload/v1710650466/uxtx2rboadesfg9ln2zr.png'),(14,6,'http://res.cloudinary.com/dptlnmlvx/image/upload/v1710650468/vigtgm55oclcf0vbksho.jpg'),(15,7,'http://res.cloudinary.com/dptlnmlvx/image/upload/v1710650588/igjd51v4rbp9xyvi1l38.jpg'),(16,7,'http://res.cloudinary.com/dptlnmlvx/image/upload/v1710650595/hw995ge7vn8xj94pf1i9.png'),(17,7,'http://res.cloudinary.com/dptlnmlvx/image/upload/v1710650597/bx9erfufl6zgfnvoexn3.jpg'),(18,8,'http://res.cloudinary.com/dptlnmlvx/image/upload/v1710650758/fxpmqtyv8q7pny3xvzn7.jpg'),(19,8,'http://res.cloudinary.com/dptlnmlvx/image/upload/v1710650759/hkizimprtu0ttczpayh1.jpg'),(20,8,'http://res.cloudinary.com/dptlnmlvx/image/upload/v1710650761/colfg2ufiilwt8gxnwax.jpg'),(21,8,'http://res.cloudinary.com/dptlnmlvx/image/upload/v1710650765/kt6biwvy4exkhw2xpzhc.png'),(22,8,'http://res.cloudinary.com/dptlnmlvx/image/upload/v1710650768/xvzp7hazv5dsvybma6nd.jpg');
/*!40000 ALTER TABLE `hinhanh` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-03-17 13:55:18
