import { Op } from "sequelize";
import Loan from "../models/loan"
import { LoanModel } from "../models/loanModel";
import { CopyModel } from "../models/copyModel";
import { BookModel } from "../models/bookModel";
import "../models/associations";

export async function getLoans(personId: number): Promise<Loan[]> {
    const loans = await LoanModel.findAll({
        where: { userId: personId },
        include: [{ model: CopyModel, include: [BookModel] }],
    });

    return loans.map((loan) => {
        const copy = loan.get('Copy') as CopyModel & { Book: BookModel };
        return new Loan(loan.id, loan.userId, copy.Book.isbn, copy.Book.title, new Date(loan.due));
    });
}


export async function makeLoan(personId: number, copyId: number, due: Date): Promise<void> {
    await LoanModel.create({
        copyId,
        userId: personId,
        due,
    });
}

export async function removeLoan(id: number): Promise<void> {
    await LoanModel.destroy({ where: { id }});
}

export async function getCopyID(isbn: string): Promise<number> {
    const loanedCopyIds = (await LoanModel.findAll({ attributes: ['copyId'] })).map((loan) => loan.copyId);

    const copy = await CopyModel.findOne({
        where: {
            bookIsbn: isbn,
            ...(loanedCopyIds.length > 0 ? { id: { [Op.notIn]: loanedCopyIds } } : {}),
        },
    });

    return copy ? copy.id : -1;
}