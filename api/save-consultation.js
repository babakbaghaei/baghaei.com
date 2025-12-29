// API endpoint for saving consultation bookings to PostgreSQL
// This should be deployed as a serverless function (Vercel, Netlify, etc.)

const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_NXrMy0KVPbf4@ep-shy-night-a15k3q4f-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
    ssl: {
        rejectUnauthorized: false
    }
});

// Create table if not exists
async function initTable() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS consultations (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255),
                phone VARCHAR(20),
                message TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
    } catch (error) {
        console.error('Error creating table:', error);
    }
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        await initTable();

        const { name, email, phone, message } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }

        // At least one contact method should be provided
        if (!email && !phone) {
            return res.status(400).json({ error: 'At least one contact method (email or phone) is required' });
        }

        // Insert into database
        const result = await pool.query(
            'INSERT INTO consultations (name, email, phone, message) VALUES ($1, $2, $3, $4) RETURNING id',
            [name, email || null, phone || null, message || null]
        );

        return res.status(200).json({ 
            success: true, 
            id: result.rows[0].id,
            message: 'Consultation request saved successfully' 
        });
    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

