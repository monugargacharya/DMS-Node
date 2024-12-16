const sql = require('mysql2');

const conn = sql.createPool({
    host: '134.255.182.27',
    user: 'manav',
    password: 'ManavPass@2025',
    database: 'dms_shree_ram_pharma',
    connectionLimit: 100,
    port:3306,
    multipleStatements: true
});

module.exports = conn;
