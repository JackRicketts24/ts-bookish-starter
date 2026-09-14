import { Router, Request, Response } from 'express';
import { getLoans } from '../repositories/loanRepository';

class LoanController {
    router: Router;

    constructor() {
        this.router = Router();

        this.router.get('/', this.getLoans.bind(this));
        this.router.post('/borrow', this.borrow.bind(this));
    }

    async getLoans(req: Request, res: Response) {
        const personID = req.body.personID;
        try {
            return res.status(200).json({
                loans: await getLoans(personID)
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error: "Unable to connect to database"
            });
        }
    }

    async borrow(req: Request, res: Response) {

    }
}

export default new LoanController().router;
