import express from 'express';
import 'dotenv/config';

import passport, { authenticate } from './middleware/authenticate';
import { sequelize } from './db/sequelize';
import healthcheckRoutes from './controllers/healthcheckController';
import bookRoutes from './controllers/bookController';
import loanRoutes from './controllers/loanController';
import personRoutes from './controllers/personController';

const port = process.env['PORT'] || 3001;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});

sequelize.authenticate()
    .then(() => console.log('Sequelize connected to the database.'))
    .catch((err) => console.error('Sequelize failed to connect to the database:', err));

/**
 * Primary app routes.
 */
app.use('/healthcheck', healthcheckRoutes);
app.use('/books', bookRoutes);
app.use('/loans', authenticate, loanRoutes);
app.use('/auth', personRoutes);