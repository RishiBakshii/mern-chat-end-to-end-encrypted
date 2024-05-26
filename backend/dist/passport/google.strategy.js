var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passport from 'passport';
import { User } from '../models/user.model.js';
import { env } from '../schemas/env.schema.js';
import bcrypt from 'bcryptjs';
import { config } from '../config/env.config.js';
import { DEFAULT_AVATAR } from '../constants/file.constant.js';
passport.use(new GoogleStrategy({
    clientID: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${config.callbackUrl}/google/callback`
}, function (accessToken, refreshToken, profile, done) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        try {
            if (profile.emails && profile.emails[0].value && profile.displayName) {
                const isExistingUser = yield User.findOne({ email: profile.emails[0].value });
                if (isExistingUser) {
                    const transformedUser = {
                        _id: isExistingUser._id,
                        username: isExistingUser.username,
                        name: isExistingUser.name,
                        avatar: (_a = isExistingUser.avatar) === null || _a === void 0 ? void 0 : _a.secureUrl,
                        email: isExistingUser.email,
                        verified: isExistingUser.verified
                    };
                    done(null, transformedUser);
                }
                else {
                    let avatarUrl = DEFAULT_AVATAR;
                    if (profile.photos && profile.photos[0].value) {
                        avatarUrl = profile.photos[0].value;
                    }
                    const newUser = yield User.create({
                        username: profile.displayName,
                        name: (_b = profile.name) === null || _b === void 0 ? void 0 : _b.givenName,
                        avatar: {
                            secureUrl: avatarUrl
                        },
                        email: profile.emails[0].value,
                        password: yield bcrypt.hash(profile.id, 10),
                        verified: true
                    });
                    const transformedUser = {
                        _id: newUser._id,
                        username: newUser.username,
                        name: newUser.name,
                        avatar: (_c = newUser.avatar) === null || _c === void 0 ? void 0 : _c.secureUrl,
                        email: newUser.email,
                        verified: newUser.verified
                    };
                    done(null, transformedUser);
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
//# sourceMappingURL=google.strategy.js.map