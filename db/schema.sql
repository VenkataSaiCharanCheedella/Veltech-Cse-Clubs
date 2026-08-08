-- Execute this script in your TiDB Serverless SQL Editor

USE test;

DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS contact_queries;

CREATE TABLE applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    category VARCHAR(50) NOT NULL,
    vtu VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    year VARCHAR(20),
    dept VARCHAR(50),
    section VARCHAR(20),
    clubName VARCHAR(100),
    position VARCHAR(100),
    skills TEXT,
    whyJoin TEXT,
    github VARCHAR(255),
    linkedin VARCHAR(255),
    mentorName VARCHAR(255),
    mentorPhone VARCHAR(20),
    reason TEXT,
    UNIQUE KEY (email, category),
    UNIQUE KEY (vtu, category)
);

CREATE TABLE contact_queries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    name VARCHAR(255) NOT NULL,
    vtu VARCHAR(20) NOT NULL,
    year VARCHAR(20),
    query TEXT NOT NULL
);
