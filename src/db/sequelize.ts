import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize({
    dialect: 'mssql',
    host: process.env['DB_SERVER'] || 'localhost',
    port: Number(process.env['DB_PORT']) || 1433,
    database: process.env['DB_NAME'],
    username: process.env['DB_USER'],
    password: process.env['DB_PASSWORD'],
    dialectOptions: {
        options: {
            trustServerCertificate: true,
        },
    },
    logging: false,
});
