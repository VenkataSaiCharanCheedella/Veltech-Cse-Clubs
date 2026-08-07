-- Execute this script in your TiDB Serverless SQL Editor

CREATE TABLE IF NOT EXISTS applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    category VARCHAR(50) NOT NULL,
    positionApplied VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    vtu VARCHAR(10) NOT NULL,
    year VARCHAR(20) NOT NULL,
    branch VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    reason TEXT,
    UNIQUE KEY (email, category),
    UNIQUE KEY (vtu, category)
);

CREATE TABLE IF NOT EXISTS contact_queries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    name VARCHAR(255) NOT NULL,
    vtu VARCHAR(10) NOT NULL,
    year VARCHAR(20) NOT NULL,
    query TEXT NOT NULL
);
