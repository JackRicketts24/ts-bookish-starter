export default class Loan {
    personID: number;
    bookISBN: string;
    bookTitle: string;
    due: Date;

    constructor(personID: number, bookISBN: string, bookTitle: string, date: Date) {
        this.personID = personID;
        this.bookISBN = bookISBN;
        this.bookTitle = bookTitle;
        // this.due = new Date(dateString);
        this.due = date
    }
}
