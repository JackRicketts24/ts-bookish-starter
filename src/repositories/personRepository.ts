import { Request, TYPES } from 'tedious';

import { createConnection } from '../db/connection';
import Person from '../models/person';

interface ResultColumn {
    metadata: { colName: string };
    value: string | number;
}

export function createPerson(
    name: string,
    hashedPassword: string,
): Promise<Person> {
    return new Promise((resolve, reject) => {
        createConnection()
            .then((connection) => {
                let personID: number | undefined;

                const request = new Request(
                    `INSERT INTO Person (name, password)
                    OUTPUT INSERTED.id AS id
                    VALUES (@name, @password);`,
                    (err) => {
                        connection.close();

                        if (err) {
                            return reject(err);
                        }
                        return resolve(
                            new Person(
                                personID as number,
                                name,
                                hashedPassword,
                            ),
                        );
                    },
                );

                request.on('row', (columns: ResultColumn[]) => {
                    personID = columns[0].value as number;
                });

                request.addParameter('name', TYPES.VarChar, name);
                request.addParameter('password', TYPES.VarChar, hashedPassword);

                connection.execSql(request);
            })
            .catch(reject);
    });
}

export function getPersonsByName(name: string): Promise<Person[]> {
    return new Promise((resolve, reject) => {
        createConnection()
            .then((connection) => {
                const people: Person[] = [];

                const request = new Request(
                    `SELECT id, name, password
                    FROM Person
                    WHERE name = @name;`,
                    (err) => {
                        connection.close();

                        if (err) {
                            return reject(err);
                        }
                        return resolve(people);
                    },
                );

                request.on('row', (columns: ResultColumn[]) => {
                    const values: Record<string, string | number> = {};
                    columns.forEach((column) => {
                        values[column.metadata.colName] = column.value;
                    });

                    people.push(
                        new Person(
                            values['id'] as number,
                            values['name'] as string,
                            values['password'] as string,
                        ),
                    );
                });

                request.addParameter('name', TYPES.VarChar, name);

                connection.execSql(request);
            })
            .catch(reject);
    });
}

export function getPersonById(personID: number): Promise<Person | null> {
    return new Promise((resolve, reject) => {
        createConnection()
            .then((connection) => {
                let person: Person | null = null;

                const request = new Request(
                    `SELECT id, name, password
                    FROM Person
                    WHERE id = @id;`,
                    (err) => {
                        connection.close();

                        if (err) {
                            return reject(err);
                        }
                        return resolve(person);
                    },
                );

                request.on('row', (columns: ResultColumn[]) => {
                    const values: Record<string, string | number> = {};
                    columns.forEach((column) => {
                        values[column.metadata.colName] = column.value;
                    });

                    person = new Person(
                        values['id'] as number,
                        values['name'] as string,
                        values['password'] as string,
                    );
                });

                request.addParameter('id', TYPES.Int, personID);

                connection.execSql(request);
            })
            .catch(reject);
    });
}
