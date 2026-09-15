import { UniqueConstraintError } from 'sequelize';

import { sequelize } from '../db/sequelize';
import { BookModel } from '../models/bookModel';
import { CopyModel } from '../models/copyModel';
import '../models/associations';

export class DuplicateIsbnError extends Error {
    constructor(isbn: string) {
        super(`A book with ISBN ${isbn} already exists.`);
        this.name = 'DuplicateIsbnError';
    }
}

interface BookWithCopies {
    title: string;
    authors: string;
    isbn: string;
    copies: number;
}

function toBooks(books: BookModel[]): BookWithCopies[] {
    return books.map(
        (book) => ({
            title: book.title,
            authors: book.authors,
            isbn: book.isbn,
            copies: Number(book.get('copies')),
        })
    );
}

export async function getAllBooks(): Promise<BookWithCopies[]> {
    const books = await BookModel.findAll({
        attributes: {
            include: [[sequelize.fn('COUNT', sequelize.col('Copies.id')), 'copies']],
        },
        include: [{ model: CopyModel, attributes: [] }],
        group: ['Book.isbn', 'Book.title', 'Book.authors'],
        order: [['title', 'ASC']],
        subQuery: false,
    });

    return toBooks(books);
}

export async function addBook(
    title: string,
    authors: string,
    isbn: string,
): Promise<void> {
    try {
        await BookModel.create({ title, authors, isbn });
    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            throw new DuplicateIsbnError(isbn);
        }
        throw err;
    }
}

export async function addCopy(isbn: string): Promise<void> {
    await CopyModel.create({ bookIsbn: isbn });
}

export async function findBook(title: string): Promise<BookWithCopies[]> {
    const books = await BookModel.findAll({
        attributes: {
            include: [[sequelize.fn('COUNT', sequelize.col('Copies.id')), 'copies']],
        },
        include: [{ model: CopyModel, attributes: [] }],
        where: { title },
        group: ['Book.isbn', 'Book.title', 'Book.authors'],
        order: [['title', 'ASC']],
        subQuery: false,
    });

    return toBooks(books);
}