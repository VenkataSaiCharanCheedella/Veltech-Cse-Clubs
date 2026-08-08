const mysql = require('mysql2/promise');
require('dotenv').config();

// Create connection pool lazily to avoid crashing on boot if env is missing
let pool;
function getPool() {
    if (!pool) {
        pool = mysql.createPool({
            uri: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: true },
            connectionLimit: 10
        });
    }
    return pool;
}

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'GET') {
        const action = req.query.action;
        if (action === 'getSettings') {
            return res.status(200).json({ status: 'success', settings: { registration_status: 'OPEN' } });
        }
        return res.status(200).json({ status: 'success', message: 'API is running' });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        let body = req.body;
        if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch(e){}
        }

        const action = body.action;
        const data = body.data;

        if (action === 'submitApplication') {
            const db = getPool();
            if (data.category === 'ContactQuery') {
                await db.execute(
                    `INSERT INTO contact_queries (name, vtu, year, query) VALUES (?, ?, ?, ?)`,
                    [data.name || null, data.vtu || null, data.year || null, data.query || null]
                );
                return res.status(200).json({ status: 'success', message: 'Query submitted successfully' });
            } else {
                await db.execute(
                    `INSERT INTO applications (category, vtu, name, email, phone, year, dept, section, clubName, position, skills, whyJoin, github, linkedin, mentorName, mentorPhone, reason) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        data.category || null, 
                        data.vtu || null, 
                        data.name || null, 
                        data.email || null, 
                        data.phone || null, 
                        data.year || null, 
                        data.dept || null, 
                        data.section || null, 
                        data.clubName || null, 
                        data.position || data.applyingAs || null, 
                        data.skills || null, 
                        data.whyJoin || null, 
                        data.github || null, 
                        data.linkedin || null, 
                        data.mentorName || null, 
                        data.mentorPhone || null, 
                        data.reason || null
                    ]
                );
                return res.status(200).json({ status: 'success', message: 'Application submitted successfully' });
            }
        }

        return res.status(400).json({ error: 'Invalid Action' });
    } catch (error) {
        console.error('Database Error:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ status: 'error', message: 'You have already applied for this category.' });
        }
        return res.status(500).json({ status: 'error', message: error.message || 'Database error occurred' });
    }
}
