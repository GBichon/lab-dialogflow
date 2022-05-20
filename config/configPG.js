require('dotenv').config();

module.exports = {
    host: process.env.PGSQL_HOST,
    port: process.env.PGSQL_PORT,
    user: process.env.PGSQL_USERNAME,
    password: process.env.PGSQL_PASSWORD,
    database: process.env.PGSQL_DATABASE,
    max:20,
    // number of milliseconds a client must sit idle in the pool and not be checked out
    // before it is disconnected from the backend and discarded
    // default is 10000 (10 seconds) - set to 0 to disable auto-disconnection of idle clients
    idleTimeoutMillis: 0,
    // number of milliseconds to wait before timing out when connecting a new client
    // by default this is 0 which means no timeout
    connectionTimeoutMillis: 10000
}
