import passport from 'passport';
import {
    Strategy as JwtStrategy,
    ExtractJwt,
    StrategyOptions,
} from 'passport-jwt';

import { getPersonById } from '../repositories/personRepository';

interface JwtPayload {
    personID: number;
}

const options: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env['JWT_SECRET'] || '',
};

passport.use(
    new JwtStrategy(options, (payload: JwtPayload, done) => {
        getPersonById(payload.personID)
            .then((person) => {
                if (!person) {
                    return done(null, false);
                }
                return done(null, person);
            })
            .catch((error) => done(error, false));
    }),
);

export const authenticate = passport.authenticate('jwt', { session: false });

export default passport;
