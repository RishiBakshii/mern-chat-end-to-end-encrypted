import {Strategy as GoogleStrategy} from 'passport-google-oauth20'
import passport from 'passport'
import { User } from '../models/user.model.js';
import { env } from '../schemas/env.schema.js';
import bcrypt from 'bcryptjs'
import { config } from '../config/env.config.js';

passport.use(new GoogleStrategy({
    clientID: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${config.callbackUrl}/google/callback`
  },

  async function (accessToken, refreshToken, profile, done){

    try {
      if(profile.emails && profile.photos && profile.displayName){
          const isExistingUser = await User.findOne({email:profile.emails[0].value})

          if(isExistingUser){
            done(null,isExistingUser)
          }
          else{
            const newUser = await User.create({username:profile.displayName,name:profile.displayName,avatar:profile.photos[0].value,email:profile.emails[0].value,password:await bcrypt.hash(profile.id,10),verified:true})
            done(null,newUser)
          }
      }
      else{
        throw new Error("Some Error occured")
      }
    } catch (error) {
      console.log(error);
      done('Some error occured',undefined)
    }

  }
));