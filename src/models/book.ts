export default class Book {
    title: string;
    authors: string;
    isbn: string;

    constructor(title: string, authors: string, isbn: string) {
        this.title = title;
        this.authors = authors;
        this.isbn = isbn;
    }
}
