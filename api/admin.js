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
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
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
        if (typeof body === 'string') {
            body = JSON.parse(body);
        }

        const { action, username, password } = body;

        // Secure Server-Side Password Validation
        // Set ADMIN_USER and ADMIN_PASS in your Vercel Environment Variables
        const validUser = process.env.ADMIN_USER || 'admin';
        const validPass = process.env.ADMIN_PASS || 'ChangeMe123!';

        if (username !== validUser || password !== validPass) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (action === 'getAdminData') {
            // Fetch all applications
            const [applications] = await pool.execute(`SELECT * FROM applications ORDER BY timestamp DESC`);
            
            // Fetch all contact queries
            const [contactQueries] = await pool.execute(`SELECT * FROM contact_queries ORDER BY timestamp DESC`);

            return res.status(200).json({ 
                status: 'success', 
                data: {
                    applications: applications,
                    contactQueries: contactQueries
                }
            });
        }

        return res.status(400).json({ error: 'Invalid Action' });

    } catch (error) {
        console.error('Database Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
