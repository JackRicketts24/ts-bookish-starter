import { PersonModel } from '../models/personModel';

export async function createPerson(
    name: string,
    hashedPassword: string,
): Promise<PersonModel> {
    return PersonModel.create({
        name,
        password: hashedPassword
    });
}

export async function getPersonsByName(name: string): Promise<PersonModel[]> {
    return PersonModel.findAll({
        where: { name }
    });
}

export async function getPersonById(personID: number): Promise<PersonModel | null> {
    return PersonModel.findByPk(personID);
}
