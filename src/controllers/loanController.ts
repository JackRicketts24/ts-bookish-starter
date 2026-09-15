import { Router, Request, Response } from 'express';
import { getCopyID, getLoans, makeLoan, removeLoan } from '../repositories/loanRepository';
import { PersonModel } from '../models/personModel';

class LoanController {
    router: Router;

    constructor() {
        this.router = Router();

        this.router.get('/', this.getLoans.bind(this));
        this.router.post('/borrow', this.borrow.bind(this));
        this.router.post('/return', this.returnLoan.bind(this));
    }

    async getLoans(req: Request, res: Response) {
        const personID = (req.user as PersonModel).id;
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
        const personID = (req.user as PersonModel).id;
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

    async returnLoan(req: Request, res: Response) {
        const loanID = req.body.loanId;
        try {
            await removeLoan(loanID);
            return res.status(200).json({
                msg: "Book returned."
            });
        } catch (error) {
            console.error(error);
            return res.status(400).json({
                error: "Invalid loan ID provided."
            });
        }
    }
}

export default new LoanController().router;
