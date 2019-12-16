DROP DATABASE forum;
CREATE DATABASE forum;

USE forum;
DROP TABLE IF EXISTS user;
CREATE TABLE user(
    id VARCHAR(20),
    password VARCHAR(20),
    nickname VARCHAR(20),
    gender VARCHAR(5),
    age SMALLINT,
    description VARCHAR(200),
    avatar VARCHAR(200),
    PRIMARY KEY(id)
);

DROP TABLE IF EXISTS post;
CREATE TABLE post(
    id INT AUTO_INCREMENT,
    title VARCHAR(50),
    content VARCHAR(200),
    uid VARCHAR(20),
    nickname VARCHAR(20),
    avatar VARCHAR(200),
    PRIMARY KEY(id)
);

DROP TABLE IF EXISTS talkinfo;
CREATE TABLE talkinfo(
    id INT AUTO_INCREMENT,
    content VARCHAR(200),
    senderid VARCHAR(20),
    receiverid VARCHAR(20),
    receivername VARCHAR(20),
    sendtime BIGINT,
    senderavatar VARCHAR(200),
    receiveravatar VARCHAR(200),
    PRIMARY KEY(id)
);

DROP TABLE IF EXISTS postreply;
CREATE TABLE postreply(
    id INT AUTO_INCREMENT,
    uid VARCHAR(20),
    nickname VARCHAR(20),
    avatar VARCHAR(200),
    publishtime BIGINT,
    directreply SMALLINT,
    replyto INT,
    postgroup INT,
    PRIMARY KEY(id)
);

DROP TABLE if EXISTS friend;
CREATE TABLE friend(
    id INT AUTO_INCREMENT,
    oneid VARCHAR(20),
    twoid VARCHAR(20),
    onename VARCHAR(20),
    twoname VARCHAR(20),
    oneavatar VARCHAR(200),
    twoavatar VARCHAR(200),
    PRIMARY KEY(id)
);
