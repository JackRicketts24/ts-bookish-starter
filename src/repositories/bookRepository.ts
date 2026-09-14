import { Request, TYPES } from 'tedious';

import { createConnection } from '../db/connection';
import Book from '../models/book';

interface ResultColumn {
    metadata: { colName: string };
    value: string | number;
}

interface SqlError extends Error {
    number?: number;
}

const SQL_PRIMARY_KEY_VIOLATION = 2627;

export class DuplicateIsbnError extends Error {
    constructor(isbn: string) {
        super(`A book with ISBN ${isbn} already exists.`);
        this.name = 'DuplicateIsbnError';
    }
}

export function getAllBooks(): Promise<Book[]> {
    return new Promise((resolve, reject) => {
        createConnection()
            .then((connection) => {
                const books: Book[] = [];

                const request = new Request(
                    'SELECT title, authors, ISBN FROM Book',
                    (err) => {
                        connection.close();

                        if (err) {
                            return reject(err);
                        }
                        return resolve(books);
                    },
                );

                request.on('row', (columns: ResultColumn[]) => {
                    const values: Record<string, string | number> = {};
                    columns.forEach((column) => {
                        values[column.metadata.colName] = column.value;
                    });

                    books.push(
                        new Book(
                            values['title'] as string,
                            values['authors'] as string,
                            values['ISBN'] as string,
                        ),
                    );
                });

                connection.execSql(request);
            })
            .catch(reject);
    });
}

export function addBook(
    title: string,
    authors: string,
    isbn: string,
): Promise<void> {
    return new Promise((resolve, reject) => {
        createConnection()
            .then((connection) => {
                const request = new Request(
                    `INSERT INTO Book (title, authors, ISBN)
                    VALUES (@title, @authors, @isbn);`,
                    (err: SqlError | null | undefined) => {
                        connection.close();

                        if (err) {
                            if (err.number === SQL_PRIMARY_KEY_VIOLATION) {
                                return reject(new DuplicateIsbnError(isbn));
                            }
                            return reject(err);
                        }
                        return resolve();
                    },
                );

                request.addParameter('title', TYPES.VarChar, title);
                request.addParameter('authors', TYPES.VarChar, authors);
                request.addParameter('isbn', TYPES.VarChar, isbn);

                connection.execSql(request);
            })
            .catch(reject);
    });
}