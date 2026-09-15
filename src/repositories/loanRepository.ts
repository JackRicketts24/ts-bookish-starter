import { Request, TYPES } from "tedious";
import { createConnection } from "../db/connection"
import Loan from "../models/loan"

export function getLoans(personId: number): Promise<Loan[]> {
    return new Promise((resolve, reject) => {
        createConnection()
            .then((connection) => {
                const loans: Loan[] = [];
                const request = new Request(
                    `SELECT l.user_id AS personID, b.isbn AS bookISBN, b.title AS bookTitle, l.due AS due
                    FROM Loan l
                    JOIN Copy c ON c.id = l.copy_id
                    JOIN Book b ON b.isbn = c.book_isbn
                    WHERE l.user_id = @personId;`,
                    (err) => {
                        connection.close();
                        if (err) {
                            return reject(err);
                        }
                        return resolve(loans);
                    }
                );

                request.addParameter('personId', TYPES.Int, personId);

                connection.execSql(request);
            })
            .catch(reject);
    })
}


export function makeLoan(personId: number, copyId: number, due: Date): Promise<void> {
    return new Promise((resolve, reject) => {
        createConnection()
            .then((connection) => {
                const request = new Request(
                    `INSERT INTO Loan(copy_id, user_id, due)
                    VALUES (@copyId, @userId, @due)`,
                    (err) => {
                        connection.close();
                        if (err) {
                            return reject(err);
                        }
                        return resolve();
                    }
                );

                request.addParameter('copyId', TYPES.Int, copyId);
                request.addParameter('userId', TYPES.Int, personId);
                request.addParameter('due', TYPES.Date, due);

                connection.execSql(request);
            })
            .catch(reject);
    })
}

export function getCopyID(isbn: string): Promise<number> {
    return new Promise((resolve, reject) => {
        createConnection()
            .then((connection) => {
                let copyId: number = -1;
                const request = new Request(
                    `SELECT TOP 1 c.id AS copyId
                    FROM Copy c
                    WHERE c.book_isbn = @isbn
                    AND c.id NOT IN (SELECT l.copy_id FROM Loan l);`,
                    (err) => {
                        connection.close();
                        if (err) {
                            return reject(err);
                        }
                        return resolve(copyId);
                    }
                );

                request.on('row', (columns) => {
                    copyId = columns[0].value;
                });

                request.addParameter('isbn', TYPES.VarChar, isbn);
                connection.execSql(request);
            })
            .catch(reject);
    });
}