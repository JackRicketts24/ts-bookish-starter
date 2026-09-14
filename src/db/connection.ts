import { Connection, ConnectionConfiguration } from 'tedious';

const config: ConnectionConfiguration = {
    server: process.env['DB_SERVER'] || 'localhost',
    authentication: {
        type: 'default',
        options: {
            userName: process.env['DB_USER'],
            password: process.env['DB_PASSWORD'],
        },
    },
    options: {
        database: process.env['DB_NAME'],
        port: Number(process.env['DB_PORT']) || 1433,
        trustServerCertificate: true,
    },
};

export function createConnection(): Promise<Connection> {
    return new Promise((resolve, reject) => {
        const connection = new Connection(config);
        connection.on('connect', (err) => {
            if (err) {
                return reject(err);
            }
            return resolve(connection);
        });
        connection.connect();
    });
}
