import { Strategy as GithubStrategy } from 'passport-github2';
import passport from 'passport';
import { User } from '../models/user.model.js';
import { env } from '../schemas/env.schema.js';
import bcrypt from 'bcryptjs';
import { config } from '../config/env.config.js';
passport.use(new GithubStrategy({
    clientID: env.GITHUB_CLIENT_ID,
    clientSecret: env.GITHUB_CLIENT_SECRET,
    callbackURL: `${config.callbackUrl}/github/callback`
}, async function (accessToken, refreshToken, profile, done) {
    try {
        if (profile.displayName && profile.username && profile.photos[0].value && profile.id) {
            if (profile._json.email) {
                const isExistingUser = await User.findOne({ email: profile._json.email });
                if (isExistingUser) {
                    done(null, isExistingUser);
                }
                else {
                    const newUser = await User.create({ username: profile.displayName, name: profile.username, avatar: profile.photos[0].value, email: profile._json.email, password: await bcrypt.hash(profile.id, 10), verified: true });
                    done(null, newUser);
                }
            }
            else {
                const isExistingUser = await User.findOne({ username: profile.displayName });
                if (isExistingUser) {
                    done(null, isExistingUser);
                }
                else {
                    const newUser = await User.create({ username: profile.displayName, name: profile.username, avatar: profile.photos[0].value, email: 'notProvided', password: await bcrypt.hash(profile.id, 10), verified: true });
                    done(null, newUser);
                }
            }
        }
        else {
            throw new Error("Some Error occured");
        }
    }
    catch (error) {
        console.log(error);
        done('Some error occured', undefined);
    }
}));
