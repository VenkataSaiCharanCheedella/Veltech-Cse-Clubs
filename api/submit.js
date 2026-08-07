const mysql = require('mysql2/promise');
require('dotenv').config();

// Create connection pool
const pool = mysql.createPool({
    uri: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: true },
    connectionLimit: 10
});

module.exports = async function handler(req, res) {
    // CORS headers for security and API access
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        let body = req.body;
        // In case the frontend sends a stringified payload instead of JSON
        if (typeof body === 'string') {
            body = JSON.parse(body);
        }

        const action = body.action;
        const data = body.data;

        if (action === 'submitApplication') {
            if (data.category === 'ContactQuery') {
                const [result] = await pool.execute(
                    `INSERT INTO contact_queries (name, vtu, year, query) VALUES (?, ?, ?, ?)`,
                    [data.name, data.vtu, data.year, data.query]
                );
                return res.status(200).json({ status: 'success', message: 'Query submitted successfully' });
            } else {
                // Application (Leadership or Club)
                const [result] = await pool.execute(
                    `INSERT INTO applications (category, positionApplied, name, email, vtu, year, branch, phone, reason) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [data.category, data.positionApplied, data.name, data.email, data.vtu, data.year, data.branch, data.phone, data.reason || '']
                );
                return res.status(200).json({ status: 'success', message: 'Application submitted successfully' });
            }
        }

        return res.status(400).json({ error: 'Invalid Action' });

    } catch (error) {
        console.error('Database Error:', error);
        
        // Handle Duplicate Entry Error specifically
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'DUPLICATE', message: 'You have already applied for this category.' });
        }
        
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
