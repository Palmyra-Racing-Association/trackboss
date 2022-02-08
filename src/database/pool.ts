import mysql from 'mysql2/promise';

const CONN_LIMIT = 10;
const QUEUE_LIMIT = 0;

const pool = mysql.createPool({
    host: 'localhost',
    user: 'dev',
    password: 'devpass',
    database: 'pradb',
    waitForConnections: true,
    connectionLimit: CONN_LIMIT,
    queueLimit: QUEUE_LIMIT,
});

export default pool;
