import { Router, Request, Response } from 'express';
import { getCopyID, getLoans, makeLoan } from '../repositories/loanRepository';

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
        const personID = req.body.personID;
        const bookISBN = req.body.isbn;
        const dueDate = req.body.due;

        const copyID = await getCopyID(bookISBN);
        if (copyID === -1) {
            return res.status(409).json({
                error: "No copies available."
            });
        }
        
        try {
            return res.status(201).json({
                loan: await makeLoan(personID, copyID, dueDate)
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error: "Unable to connect to database"
            });
        }
    }
}

export default new LoanController().router;
