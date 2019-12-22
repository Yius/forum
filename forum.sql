SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

CREATE DATABASE IF NOT EXISTS `forum` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `forum`;

DROP TABLE IF EXISTS `friend`;
CREATE TABLE IF NOT EXISTS `friend` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `oneid` varchar(20) DEFAULT NULL,
  `twoid` varchar(20) DEFAULT NULL,
  `onename` varchar(20) DEFAULT NULL,
  `twoname` varchar(20) DEFAULT NULL,
  `oneavatar` varchar(200) DEFAULT NULL,
  `twoavatar` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

INSERT INTO `friend` (`id`, `oneid`, `twoid`, `onename`, `twoname`, `oneavatar`, `twoavatar`) VALUES
(1, '1', '2', '小明', '小红', NULL, NULL);

DROP TABLE IF EXISTS `postreply`;
CREATE TABLE IF NOT EXISTS `postreply` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` varchar(20) DEFAULT NULL,
  `nickname` varchar(20) DEFAULT NULL,
  `avatar` varchar(200) DEFAULT NULL,
  `publishtime` bigint(20) DEFAULT NULL,
  `directreply` smallint(6) DEFAULT NULL,
  `replyto` int(11) DEFAULT NULL,
  `postgroup` int(11) DEFAULT NULL,
  `replygroup` int(11) DEFAULT NULL,
  `content` varchar(200) DEFAULT NULL,
  `title` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8;

INSERT INTO `postreply` (`id`, `uid`, `nickname`, `avatar`, `publishtime`, `directreply`, `replyto`, `postgroup`, `replygroup`, `content`, `title`) VALUES
(1, '1', '小明', NULL, 12, -1, -1, 1, -1, '小明发帖', '帖子1'),
(2, '2', '小红', NULL, 234, 1, 1, 1, 2, '小红直接回复小明', NULL),
(3, '1', '小明', NULL, 789, 0, 2, 1, 2, '小明间接回复小红', NULL),
(4, '3', '小刚', NULL, 1111, 1, 1, 1, 4, '小刚直接回复小明', NULL),
(5, '2', '小红', NULL, 2222, 0, 4, 1, 4, '小红间接回复小刚', NULL),
(6, '3', '小刚', NULL, 3333, 0, 5, 1, 4, '小明在小刚的回复中回复小红', NULL),
(7, '4', '小智', NULL, 6666, -1, -1, 7, -1, '我要成为神奇宝贝大师', '帖子2'),
(8, '3', '小刚', NULL, 7777, 1, 7, 7, 8, '小刚直接回复小智', NULL),
(9, '5', '乔伊小姐', NULL, 3333, 0, 8, 7, 8, '乔伊小姐间接回复小刚', NULL),
(10, '6', '大木博士', NULL, 9999, 0, 9, 7, 8, '大木博士间接回复乔伊小姐', NULL),
(11, '7', '小霞', NULL, 5222, 1, 7, 7, 11, '小霞直接回复小智', NULL),
(12, '1', '小明', NULL, 2019, -1, -1, 1, -1, '123', '哈哈'),
(13, '1', '小明', NULL, 2019, -1, -1, 1, -1, '123', '哈哈'),
(14, '1', '小明', NULL, 2019, -1, -1, 1, -1, '111111111111111', '哈哈'),
(15, '1', '小明', NULL, 2019, -1, -1, 15, -1, '123', '这就是你分手的借口'),
(16, '1', '小明', NULL, 1576858652884, NULL, 15, 15, 0, '如果让你重新来过', NULL),
(17, '1', '小明', NULL, 1576859030333, 1, 15, 15, 17, '如果让你重新来过', NULL),
(18, '1', '小明', NULL, 2019, 0, 17, 15, 17, '爱情让人拥有快乐', NULL),
(24, '1', '小明', NULL, 1576940434358, 0, 18, 15, 17, '回复undefined:', NULL),
(25, '1', '小明', NULL, 1576940641741, 0, 18, 15, 17, '回复:3121', NULL),
(26, '1', '小明', NULL, 1576940732629, 0, 18, 15, 17, '回复小明:也会带来折磨', NULL),
(27, '1', '小明', NULL, 1576940858286, 0, 18, 15, 17, '回复小明:', NULL),
(28, '1', '小明', NULL, 1576941215326, 0, 18, 15, 17, '回复小明:sssss', NULL),
(29, '1', '小明', NULL, 1576943100659, 0, 17, 15, 17, '1515', NULL),
(30, '1', '小明', NULL, 2019, -1, -1, 30, -1, '这里是贴子3', '贴子3'),
(31, '1', '小明', NULL, 2019, -1, -1, 31, -1, '这里是贴子4', '贴子4'),
(32, '1', '小明', NULL, 2019, -1, -1, 32, -1, '这里是贴子5\n', '贴子5'),
(33, '1', '小明', NULL, 2019, -1, -1, 33, -1, '这里是贴子6', '贴子6'),
(34, '1', '小明', NULL, 2019, -1, -1, 34, -1, '这里是贴子7', '贴子7'),
(35, '1', '小明', NULL, 2019, -1, -1, 35, -1, '这里是贴子8', '贴子8'),
(36, '1', '小明', NULL, 2019, -1, -1, 36, -1, '这里是贴子9', '贴子9'),
(37, '1', '小明', NULL, 2019, -1, -1, 37, -1, '怎么还没到20', '我哭了'),
(38, '1', '小明', NULL, 2019, -1, -1, 38, -1, '这里是贴子10', '贴子10'),
(39, '1', '小明', NULL, 2019, -1, -1, 39, -1, '这里是贴子11', '贴子11'),
(40, '1', '小明', NULL, 2019, -1, -1, 40, -1, '快到20了\n', '应该差不多了吧'),
(41, '1', '小明', NULL, 2019, -1, -1, 41, -1, '我太难了', '还差几个啊'),
(42, '1', '小明', NULL, 2019, -1, -1, 42, -1, '快到20了吧', '贴子不知道多少了'),
(43, '1', '小明', NULL, 2019, -1, -1, 43, -1, '怎么还没到20', '贴子？？'),
(44, '1', '小明', NULL, 2019, -1, -1, 44, -1, '我ri', '还差？'),
(45, '1', '小明', NULL, 2019, -1, -1, 45, -1, '2222222', '222'),
(46, '1', '小明', NULL, 2019, -1, -1, 46, -1, '✌', '终于20了'),
(47, '1', '小明', NULL, 2019, -1, -1, 47, -1, 'aaaaaaaaaaaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaa'),
(48, '1', '小明', NULL, 2019, -1, -1, 48, -1, 'sa', 'sa'),
(49, '1', '小明', NULL, 2019, -1, -1, 49, -1, 'ra', 'ra'),
(50, '1', '小明', NULL, 2019, -1, -1, 50, -1, 'a', 'f'),
(51, '1', '小明', NULL, 1576944511724, -1, -1, 51, -1, '我又来额', '我又来了'),
(52, '1', '小明', NULL, 1576944594821, 1, 51, 51, 52, '回复1', NULL),
(53, '1', '小明', NULL, 1576944608210, 0, 52, 51, 52, '回复2', NULL),
(54, '1', '小明', NULL, 1576944620851, 0, 53, 51, 52, '回复小明:禁止套娃', NULL),
(55, '1', '小明', NULL, 1576944720314, 1, 44, 44, 55, 'wwww', NULL),
(56, '1', '小明', NULL, 1576944739146, 0, 55, 44, 55, 'yyyy', NULL),
(57, '2', '小红', NULL, 1576944782018, 0, 56, 44, 55, '回复小明:qqqq', NULL);

DROP TABLE IF EXISTS `talkinfo`;
CREATE TABLE IF NOT EXISTS `talkinfo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` varchar(200) DEFAULT NULL,
  `senderid` varchar(20) DEFAULT NULL,
  `sendername` varchar(20) DEFAULT NULL,
  `receiverid` varchar(20) DEFAULT NULL,
  `receivername` varchar(20) DEFAULT NULL,
  `sendtime` bigint(20) DEFAULT NULL,
  `senderavatar` varchar(200) DEFAULT NULL,
  `receiveravatar` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8;

INSERT INTO `talkinfo` (`id`, `content`, `senderid`, `sendername`, `receiverid`, `receivername`, `sendtime`, `senderavatar`, `receiveravatar`) VALUES
(15, '小明发给小红', '1', '小明', '2', '小红', 22222, NULL, NULL),
(16, '小红发送给小明', '2', '小红', '1', '小明', 3333, NULL, NULL),
(17, '122', '1', '小明', '2', '小红', 1576771744007, NULL, NULL),
(18, '322', '1', '小明', '2', '小红', 1576771750934, NULL, NULL),
(19, '122', '1', '小明', '2', '小红', 1576771863412, NULL, NULL),
(20, '11313', '2', '小红', '1', '小明', 1576774506758, NULL, NULL),
(21, '121212', '1', '小明', '2', '小红', 1576774538179, NULL, NULL),
(22, '1313', '2', '小红', '1', '小明', 1576774545885, NULL, NULL),
(23, '1312', '2', '小红', '1', '小明', 1576775027238, NULL, NULL),
(24, '1341411', '2', '小红', '1', '小明', 1576775033926, NULL, NULL),
(25, '1313', '2', '小红', '1', '小明', 1576775392775, NULL, NULL),
(26, '123', '2', '小红', '1', '小明', 1576775548952, NULL, NULL),
(27, '1313313', '2', '小红', '1', '小明', 1576859916075, NULL, NULL),
(28, '1313', '2', '小红', '1', '小明', 1576859995007, NULL, NULL),
(29, '1313', '2', '小红', '1', '小明', 1576860003554, NULL, NULL),
(30, '1313', '2', '小红', '1', '小明', 1576860011130, NULL, NULL),
(31, '1331311', '2', '小红', '1', '小明', 1576860117219, NULL, NULL),
(32, '13124242', '2', '小红', '1', '小明', 1576860125831, NULL, NULL),
(33, 'affasgkdngnkdngkgkgggggggjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj', '2', '小红', '1', '小明', 1576860179282, NULL, NULL),
(34, 'jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj', '2', '小红', '1', '小明', 1576860293212, NULL, NULL),
(35, '阿佛但是挖法发尼克斯的可能辽宁省跟你商量个那个', '2', '小红', '1', '小明', 1576860343970, NULL, NULL),
(36, '啊放假啊救死扶伤积极SGI是德国iSGI十几个阿嗄嘎达啊放假啊救死扶伤积极SGI是德国iSGI十几个阿嗄嘎达', '2', '小红', '1', '小明', 1576860375050, NULL, NULL),
(37, '啊放假啊救死扶伤积极SGI是德国iSGI十几个阿嗄嘎达啊放假啊救死扶伤达啊个GI是', '2', '小红', '1', '小明', 1576860423482, NULL, NULL);

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` varchar(20) NOT NULL,
  `password` varchar(20) DEFAULT NULL,
  `nickname` varchar(20) DEFAULT NULL,
  `gender` varchar(5) DEFAULT NULL,
  `bornyear` smallint(6) DEFAULT NULL,
  `description` varchar(200) DEFAULT NULL,
  `avatar` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `user` (`id`, `password`, `nickname`, `gender`, `bornyear`, `description`, `avatar`) VALUES
('1', '123', '小明', 'M', 1111, NULL, NULL),
('2', '123', '小红', 'F', 2222, NULL, NULL),
('3', '123', '小刚', 'M', 3333, NULL, NULL),
('4', '123', '小智', 'M', 4444, NULL, NULL),
('5', '123', '乔伊小姐', 'F', 5555, NULL, NULL),
('6', '123', '大木博士', 'M', 6666, NULL, NULL),
('7', '123', '小霞', 'F', 7777, NULL, NULL);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
