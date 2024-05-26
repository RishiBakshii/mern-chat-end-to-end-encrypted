var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
}, function (accessToken, refreshToken, profile, done) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (profile.displayName && profile.username && profile.photos[0].value && profile.id) {
                if (profile._json.email) {
                    const isExistingUser = yield User.findOne({ email: profile._json.email });
                    if (isExistingUser) {
                        done(null, isExistingUser);
                    }
                    else {
                        const newUser = yield User.create({ username: profile.displayName, name: profile.username, avatar: profile.photos[0].value, email: profile._json.email, password: yield bcrypt.hash(profile.id, 10), verified: true });
                        done(null, newUser);
                    }
                }
                else {
                    const isExistingUser = yield User.findOne({ username: profile.displayName });
                    if (isExistingUser) {
                        done(null, isExistingUser);
                    }
                    else {
                        const newUser = yield User.create({ username: profile.displayName, name: profile.username, avatar: profile.photos[0].value, email: 'notProvided', password: yield bcrypt.hash(profile.id, 10), verified: true });
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
    });
}));
//# sourceMappingURL=github.strategy.js.map