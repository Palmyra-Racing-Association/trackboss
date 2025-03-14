import mysql, { Pool } from 'mysql2/promise';
import logger from '../logger';
import { getConnectionObject } from '../util/environmentWrapper';

const DEFAULT_CONN_LIMIT = 10;
const DEFAULT_QUEUE_LIMIT = 0;

// Singleton database connection pool
let pool: Pool | undefined;

const dbConnection = {
    username: '',
    password: '',
    host: '',
    dbname: '',
};

export async function initConfig() {
    const { MYSQL_HOST, MYSQL_USER, MYSQL_PASS, MYSQL_DB } = process.env;
    dbConnection.username = MYSQL_USER || '';
    dbConnection.password = MYSQL_PASS || '';
    dbConnection.host = MYSQL_HOST || '';
    dbConnection.dbname = MYSQL_DB || '';
}

(async () => {
    await initConfig();
})();

export function getPool(): Pool {
    if (!pool) {
        // Gotta build it

        // BUT FIRST: check that all the required vars are present and accounted
        // for - otherwise the server will seem to run fine... until a DB query
        // is attempted at who knows when and it crashes

        Object.keys(dbConnection).forEach((requiredEnvVar) => {
            if (!requiredEnvVar) {
                logger.error(`Fatal: error in database connection env vars. ${requiredEnvVar} missing!  Check config`);
                throw new Error('Terminating server');
            }
        });

        // These env vars are optional, so use defaults if they're not present
        // or not numbers
        const connectionLimit = Number(process.env.MYSQL_CONN_LIMIT) || DEFAULT_CONN_LIMIT;
        const queueLimit = Number(process.env.MYSQL_QUEUE_LIMIT) || DEFAULT_QUEUE_LIMIT;

        pool = mysql.createPool({
            host: dbConnection.host,
            port: 3306,
            user: dbConnection.username,
            password: dbConnection.password,
            database: dbConnection.dbname,
            waitForConnections: true,
            timezone: '+00:00',
            connectionLimit,
            queueLimit,
        });
        logger.info(`Build a connection pool to ${dbConnection.dbname}`);
    }
    return pool;
}

export async function destroyPool() {
    if (pool) {
        await pool.end();
        pool = undefined;
    }
}
