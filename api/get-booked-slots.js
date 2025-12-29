// API endpoint for getting booked consultation slots
// This should be deployed as a serverless function (Vercel, Netlify, etc.)

const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_NXrMy0KVPbf4@ep-shy-night-a15k3q4f-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
    ssl: {
        rejectUnauthorized: false
    }
});

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({ error: 'Date parameter is required' });
        }

        // Get all booked slots for the given date
        const result = await pool.query(
            'SELECT time FROM consultations WHERE date_gregorian = $1',
            [date]
        );

        const bookedTimes = result.rows.map(row => row.time);

        return res.status(200).json({ 
            success: true,
            bookedTimes: bookedTimes
        });
    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

