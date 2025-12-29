const fs = require('fs');
const path = require('path');
const { Pool } = require('@neondatabase/serverless');

// Load env vars manually
function loadEnv() {
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf8');
            envContent.split('\n').forEach(line => {
                const match = line.match(/^([^=]+)=(.*)$/);
                if (match) {
                    const key = match[1].trim();
                    const value = match[2].trim().replace(/^['"](.*)['"]$/, '$1'); // Remove quotes if present
                    if (!process.env[key]) {
                        process.env[key] = value;
                    }
                }
            });
        }
    } catch (error) {
        console.warn('Error loading .env file:', error);
    }
}

loadEnv();

if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not defined in .env');
    process.exit(1);
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function runMigration() {
    try {
        const schemaPath = path.resolve(process.cwd(), 'lib/schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Running migration...');
        const client = await pool.connect();
        try {
            await client.query(schemaSql);
            console.log('Migration completed successfully.');
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await pool.end();
    }
}

runMigration();
