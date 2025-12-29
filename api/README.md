# API Setup for Consultation Booking

## Database Connection

The API uses PostgreSQL (Neon) with the following connection string:
```
postgresql://neondb_owner:npg_NXrMy0KVPbf4@ep-shy-night-a15k3q4f-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

## Setup Options

### Option 1: Vercel Serverless Function (Recommended)

1. Create `api/save-consultation.js` (already created)
2. Install dependencies:
   ```bash
   npm install pg
   ```
3. Deploy to Vercel:
   ```bash
   vercel
   ```

### Option 2: PHP Backend

1. Use `api/save-consultation.php`
2. Make sure PHP has PostgreSQL extension enabled
3. Update the API endpoint in `assets/js/app.js` to point to your PHP file

### Option 3: Node.js Express Server

Create a simple Express server:

```javascript
const express = require('express');
const { Pool } = require('pg');
const app = express();

app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

app.post('/api/save-consultation', async (req, res) => {
    // Use code from save-consultation.js
});

app.listen(3000);
```

## Database Schema

The table is created automatically with the following structure:

```sql
CREATE TABLE consultations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    date_gregorian DATE NOT NULL,
    date_persian VARCHAR(20) NOT NULL,
    time VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Environment Variables

For production, set:
- `DATABASE_URL`: Your PostgreSQL connection string

