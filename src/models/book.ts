export default class Book {
    title: string;
    authors: string;
    isbn: string;
    copies: number;

    constructor(title: string, authors: string, isbn: string, copies: number) {
        this.title = title;
        this.authors = authors;
        this.isbn = isbn;
        this.copies = copies;
    }
}
