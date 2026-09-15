export default class Loan {
    id: number
    personID: number;
    bookISBN: string;
    bookTitle: string;
    due: Date;

    constructor(id: number, personID: number, bookISBN: string, bookTitle: string, date: Date) {
        this.id = id;
        this.personID = personID;
        this.bookISBN = bookISBN;
        this.bookTitle = bookTitle;
        this.due = date
    }
}
