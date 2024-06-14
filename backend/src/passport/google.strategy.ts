import bcrypt from 'bcryptjs';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { config } from '../config/env.config.js';
import { DEFAULT_AVATAR } from '../constants/file.constant.js';
import { User } from '../models/user.model.js';
import { env } from '../schemas/env.schema.js';

passport.use(new GoogleStrategy({
    clientID: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    callbackURL:config.callbackUrl
  },

  async function (accessToken, refreshToken, profile, done){

    try {
      if(profile.emails && profile.emails[0].value && profile.displayName){

          const isExistingUser = await User.findOne({email:profile.emails[0].value})

          if(isExistingUser){

            const transformedUser = {
              _id:isExistingUser._id,
              username:isExistingUser.username,
              name:isExistingUser.name,
              avatar:isExistingUser.avatar?.secureUrl,
              email:isExistingUser.email,
              verified:isExistingUser.verified,
              newUser:false,
              googleId:profile.id
            }

            done(null,transformedUser)
          }

          else{

            let avatarUrl = DEFAULT_AVATAR

            if(profile.photos && profile.photos[0].value){
              avatarUrl=profile.photos[0].value
            }

            const newUser = await User.create({
              username:profile.displayName,
              name:profile.name?.givenName,
              avatar:{
                secureUrl:avatarUrl
              },
              email:profile.emails[0].value,
              password:await bcrypt.hash(profile.id,10),
              verified:true,
              oAuthSignup:true,
              googleId:profile.id
            })

            const transformedUser = {
              _id:newUser._id,
              username:newUser.username,
              name:newUser.name,
              avatar:newUser.avatar?.secureUrl,
              email:newUser.email,
              verified:newUser.verified,
              newUser:true,
              googleId:profile.id
            }

            done(null,transformedUser)
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