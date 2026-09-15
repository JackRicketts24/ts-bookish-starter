import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { createPerson, getPersonsByName } from '../repositories/personRepository';
import { authenticate } from '../middleware/authenticate';
import { PersonModel } from '../models/personModel';

const SALT_ROUNDS = 10;

function signToken(person: PersonModel): string {
    const options: jwt.SignOptions = {
        expiresIn: (process.env['JWT_EXPIRY'] ||
            '1h') as jwt.SignOptions['expiresIn'],
    };
    return jwt.sign({ id: person.id }, process.env['JWT_SECRET'] || '', options);
}

class PersonController {
    router: Router;

    constructor() {
        this.router = Router();

        this.router.post('/signup', this.signup.bind(this));
        this.router.post('/login', this.login.bind(this));
        this.router.get('/validate', authenticate, this.validate.bind(this));
    }

    async signup(req: Request, res: Response) {
        const name = req.body.name;
        const password = req.body.password;

        if (!name || !password) {
            return res.status(400).json({
                error: 'name and password are required',
            });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
            const person = await createPerson(name, hashedPassword);
            return res.status(201).json({
                token: signToken(person),
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error: 'Unable to connect to database',
            });
        }
    }

    async login(req: Request, res: Response) {
        const name = req.body.name;
        const password = req.body.password;

        if (!name || !password) {
            return res.status(400).json({
                error: 'name and password are required',
            });
        }

        try {
            const candidates = await getPersonsByName(name);

            for (const person of candidates) {
                if (await bcrypt.compare(password, person.password)) {
                    return res.status(200).json({
                        token: signToken(person),
                    });
                }
            }

            return res.status(401).json({
                error: 'Invalid name or password',
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error: 'Unable to connect to database',
            });
        }
    }

    async validate(req: Request, res: Response) {
        const person = req.user as PersonModel;
        return res.status(200).json({
            id: person.id,
            name: person.name,
        });
    }
}

export default new PersonController().router;
