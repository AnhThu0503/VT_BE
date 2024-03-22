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
-- Table structure for table `sanpham`
--

DROP TABLE IF EXISTS `sanpham`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sanpham` (
  `SP_id` int(11) NOT NULL AUTO_INCREMENT,
  `DMSP_id` int(11) DEFAULT NULL,
  `SP_ten` varchar(256) DEFAULT NULL,
  `SP_NSX` date DEFAULT NULL,
  `SP_HSD` date DEFAULT NULL,
  `SP_soLuong` int(11) DEFAULT NULL,
  `SP_trongLuong` int(11) DEFAULT NULL,
  `SP_donViTinh` varchar(50) DEFAULT NULL,
  `SP_moTa` text DEFAULT NULL,
  PRIMARY KEY (`SP_id`),
  KEY `DMSP_id` (`DMSP_id`),
  CONSTRAINT `sanpham_ibfk_1` FOREIGN KEY (`DMSP_id`) REFERENCES `danhmucsanpham` (`DMSP_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sanpham`
--

LOCK TABLES `sanpham` WRITE;
/*!40000 ALTER TABLE `sanpham` DISABLE KEYS */;
INSERT INTO `sanpham` VALUES (2,2,'Bánh Trung Thu gà quay','2024-03-17','2024-03-17',10,200,'gam','Trọng lượng: 150g và 200g\n Thời hạn sử dụng: 2 tháng kể từ ngày sản xuất\n Cách dùng: Dùng ngay sau khi mở bao bì'),(6,1,'Bánh Pía khoai môn sầu riêng','2024-03-17','2024-05-17',10,600,'gam','Nguyên liệu: Khoai môn 23,8%, sầu riêng 15,7%, mứt bí, dầu thực vật, mạch nha, bột mì, lòng đỏ trứng vịt muối, đường cát, màu thực phẩm B-35-WS-P ( chiết xuất từ củ cải đỏ), maltodextrin, citric acid (E330)\n Trọng lượng: 400gr - 600gr\n Thời hạn sử dụng: 1 tháng kể từ ngày sản xuất\n Cách dùng: Ăn ngay sau khi mở bao bì'),(7,1,'Bánh Pía mè đen','2024-03-17','2024-05-17',10,600,'gam','Nguyên liệu: Đường tinh luyện, bột mì, đậu xanh, dầu olein tinh luyện, lòng đỏ trứng muối 10%, sầu riêng 9,3%, mè đen 7,4%, mạch nha, mứt bí, nước.\n Trọng lượng: 540gr (135gr x 4)\n Thời hạn sử dụng: 75 ngày kể từ ngày sản xuất\n Cách dùng: Ăn ngay sau khi mở bao bì'),(8,1,'Bánh Pía đậu xanh sầu riêng','2024-03-17','2024-05-17',10,600,'gam',' Nguyên liệu: Đậu xanh 23,8%, bột mì đường cát, sầu riêng 15,7%, dầu thực vật, mứt bí, lồng đỏ hột vịt muối, mạch nha, nước, màu thực phẩm B-35-WS-P\n Trọng lượng: 320gr - 400gr - 440gr - 540gr - 600gr\n Thời hạn sử dụng: 75 ngày kể từ ngày sản xuất\n Cách dùng: Thưởng thức ngay sau khi mở bao bì');
/*!40000 ALTER TABLE `sanpham` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-03-17 13:55:19
