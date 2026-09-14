import { Router, Request, Response } from 'express';

class LoanController {
    router: Router;

    constructor() {
        this.router = Router();
        
        this.router.get('/', this.check.bind(this));
    }

    check = (req: Request, res: Response): Response => {
        return res.status(200).json({ status: 'OK' });
    };
}

export default new LoanController().router;
