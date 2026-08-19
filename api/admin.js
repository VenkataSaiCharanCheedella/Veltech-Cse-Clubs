const mysql = require('mysql2/promise');
require('dotenv').config();

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
        
        if (action === 'getRecent') {
            try {
                const db = getPool();
                const [applications] = await db.execute(`SELECT * FROM applications ORDER BY timestamp DESC`);
                return res.status(200).json({ status: 'success', data: applications });
            } catch (err) {
                console.error(err);
                return res.status(500).json({ status: 'error', message: err.message });
            }
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

        const { action, username, password } = body;

        const validUser = process.env.ADMIN_USER || 'admin';
        const validPass = process.env.ADMIN_PASS || 'ChangeMe123!';

        if (username !== validUser || password !== validPass) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (action === 'adminLogin') {
            return res.status(200).json({ status: 'success', authenticated: true });
        }

        if (action === 'getAdminData') {
            const db = getPool();
            const [applications] = await db.execute(`SELECT * FROM applications ORDER BY timestamp DESC`);
            const [contactQueries] = await db.execute(`SELECT * FROM contact_queries ORDER BY timestamp DESC`);
            
            // Ensure table exists
            await db.execute(`
                CREATE TABLE IF NOT EXISTS role_settings (
                    role_id VARCHAR(100) PRIMARY KEY,
                    is_closed BOOLEAN DEFAULT FALSE,
                    selected_name VARCHAR(255),
                    selected_vtu VARCHAR(50)
                )
            `);
            const [roleRows] = await db.execute(`SELECT * FROM role_settings`);
            const roleConfig = {};
            let registrationStatus = 'OPEN';
            
            roleRows.forEach(r => {
                if (r.role_id === 'GLOBAL_STATUS') {
                    registrationStatus = r.selected_name || 'OPEN';
                } else {
                    roleConfig[r.role_id] = {
                        is_closed: !!r.is_closed,
                        selected_name: r.selected_name,
                        selected_vtu: r.selected_vtu
                    };
                }
            });

            return res.status(200).json({ 
                status: 'success', 
                data: {
                    applications: applications,
                    contactQueries: contactQueries,
                    roles: roleConfig
                },
                settings: {
                    registration_status: registrationStatus
                }
            });
        }
        if (action === 'saveSettings') {
            const db = getPool();
            const roles = body.roles;
            const statusText = body.statusText;
            
            if (!roles) return res.status(400).json({ error: 'Missing roles data' });
            
            const roleEntries = Object.entries(roles);
            const values = [];
            
            if (statusText) {
                 values.push('GLOBAL_STATUS', 0, statusText, null);
            }
            
            roleEntries.forEach(([roleId, config]) => {
                values.push(roleId, config.is_closed ? 1 : 0, config.selected_name || null, config.selected_vtu || null);
            });

            if (values.length > 0) {
                const placeholders = Array.from({ length: values.length / 4 }, () => '(?, ?, ?, ?)').join(', ');
                
                await db.execute(`
                    INSERT INTO role_settings (role_id, is_closed, selected_name, selected_vtu) 
                    VALUES ${placeholders}
                    ON DUPLICATE KEY UPDATE 
                        is_closed = VALUES(is_closed),
                        selected_name = VALUES(selected_name),
                        selected_vtu = VALUES(selected_vtu)
                `, values);
            }
            return res.status(200).json({ status: 'success', message: 'Settings saved' });
        }
        
        if (action === 'updateSettings') {
            const db = getPool();
            const settings = body.settings;
            if (settings && settings.registration_status) {
                await db.execute(`
                    INSERT INTO role_settings (role_id, is_closed, selected_name, selected_vtu) 
                    VALUES ('GLOBAL_STATUS', 0, ?, NULL)
                    ON DUPLICATE KEY UPDATE 
                        selected_name = VALUES(selected_name)
                `, [settings.registration_status]);
                return res.status(200).json({ status: 'success', message: 'Registration status updated' });
            }
            return res.status(400).json({ error: 'Missing registration_status' });
        }

        return res.status(400).json({ error: 'Invalid Action' });
    } catch (error) {
        console.error('Database Error:', error);
        return res.status(500).json({ status: 'error', message: error.message || 'Database error occurred' });
    }
}
