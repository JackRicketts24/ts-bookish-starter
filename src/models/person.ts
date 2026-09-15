export default class Person {
    personID: number;
    name: string;
    password: string;

    constructor(personID: number, name: string, password: string) {
        this.personID = personID;
        this.name = name;
        this.password = password;
    }
}
