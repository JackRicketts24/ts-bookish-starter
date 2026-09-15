import { Router, Request, Response } from 'express';
import {  } from '../repositories/loanRepository';

class PersonController {
    router: Router;

    constructor() {
        this.router = Router();

        this.router.get('/signup', this.signup.bind(this));
        this.router.get('/validate', this.validate.bind(this));
    }

    async signup(req: Request, res: Response) {

    }

    async validate(req: Request, res: Response) {

    }
}

export default new PersonController().router;