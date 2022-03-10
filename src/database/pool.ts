import mysql, { Pool } from 'mysql2/promise';
import logger from '../logger';

const DEFAULT_CONN_LIMIT = 10;
const DEFAULT_QUEUE_LIMIT = 0;

// Singleton database connection pool
let pool: Pool | undefined;

export function getPool(): Pool {
    if (!pool) {
        // Gotta build it

        // BUT FIRST: check that all the required vars are present and accounted
        // for - otherwise the server will seem to run fine... until a DB query
        // is attempted at who knows when and it crashes
        const { MYSQL_HOST, MYSQL_USER, MYSQL_PASS, MYSQL_DB } = process.env;
        [MYSQL_HOST, MYSQL_USER, MYSQL_PASS, MYSQL_DB].forEach((requiredEnvVar) => {
            if (!requiredEnvVar) {
                logger.error('Fatal: error in database connection environment variables');
                throw new Error('Terminating server');
            }
        });

        // These env vars are optional, so use defaults if they're not present
        // or not numbers
        const connectionLimit = Number(process.env.MYSQL_CONN_LIMIT) || DEFAULT_CONN_LIMIT;
        const queueLimit = Number(process.env.MYSQL_QUEUE_LIMIT) || DEFAULT_QUEUE_LIMIT;

        pool = mysql.createPool({
            host: MYSQL_HOST,
            user: MYSQL_USER,
            password: MYSQL_PASS,
            database: MYSQL_DB,
            waitForConnections: true,
            connectionLimit,
            queueLimit,
        });
    }
    return pool;
}

export async function destroyPool() {
    if (pool) {
        await pool.end();
        pool = undefined;
    }
}
