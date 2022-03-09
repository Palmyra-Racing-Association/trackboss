import mysql, { Pool } from 'mysql2/promise';
import logger from '../logger';

const CONN_LIMIT = 10;
const QUEUE_LIMIT = 0;

let pool: Pool | undefined;

// Build the database connection pool
//
// But first: check that all the vars are present and accounted for - otherwise
// the server will seem to run fine... until a DB query is attempted at who
// knows when
//
// (exported as its own function for testing purposes)
export function getPool(): Pool {
    if (!pool) {
        const { MYSQL_HOST, MYSQL_USER, MYSQL_PASS, MYSQL_DB } = process.env;
        [MYSQL_HOST, MYSQL_USER, MYSQL_PASS, MYSQL_DB].forEach((envVar) => {
            if (!envVar) {
                logger.error('Fatal: error in database connection environment variables');
                throw new Error('Terminating server');
            }
        });

        pool = mysql.createPool({
            host: MYSQL_HOST,
            user: MYSQL_USER,
            password: MYSQL_PASS,
            database: MYSQL_DB,
            waitForConnections: true,
            connectionLimit: CONN_LIMIT,
            queueLimit: QUEUE_LIMIT,
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
