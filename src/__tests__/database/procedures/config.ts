import 'dotenv/config';

// use vars from the env or a .env file, but unlike the real pool config, just
// use defaults if they're missing - makes life easier
const config = {
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'dev',
    password: process.env.MYSQL_PASS || 'devpass',
    database: process.env.MYSQL_DB || 'pradb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
};

export default config;
