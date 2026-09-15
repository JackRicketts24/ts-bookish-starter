import { Request, TYPES } from 'tedious';

import { createConnection } from '../db/connection';
import Person from '../models/person';
import { PersonModel } from '../models/personModel';

interface ResultColumn {
    metadata: { colName: string };
    value: string | number;
}

export async function createPerson(
    name: string,
    hashedPassword: string,
): Promise<Person> {
    const person = await PersonModel.create({
        name,
        password: hashedPassword
    });
    return new Person(person.id, person.name, person.password);
}

export async function getPersonsByName(name: string): Promise<Person[]> {
    const people = await PersonModel.findAll({
        where: { name }
    });
    return people.map((person) => new Person(person.id, person.name, person.password));
}

export async function getPersonById(personID: number): Promise<Person | null> {
    const person = await PersonModel.findByPk(personID);
    if (person)
        return new Person(person.id, person.name, person.password);
    return null;
}