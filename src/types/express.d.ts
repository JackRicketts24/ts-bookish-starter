import { PersonModel } from '../models/personModel';

declare global {
    namespace Express {
        // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- required for declaration merging with Express.User
        interface User extends PersonModel {}
    }
}

export {};
