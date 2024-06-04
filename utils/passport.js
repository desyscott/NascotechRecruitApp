import {Strategy as GoogleStrategy} from 'passport-google-oauth20'
import passport  from 'passport';
import authModel from '../models/authModel.js';


import dotenv  from "dotenv";

dotenv.config();


passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID, 
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:"https://nascotectrecruitapp-api.onrender.com/api/auth/google/callback",
    scope:["profile","email"]
},
 async (accessToken, refreshToken,callback, profile, done) => {
    // Save user data to the database or perform any other necessary operations
    const user =await authModel.findOne({ email: profile.emails[0].value });

    if(user){
        console.log("user is",user)
        return done(null,user);
    }else{
        const fullName=profile.displayName
        const nameArray = fullName.split(" ");
        const newUser = await authModel.create({
            firstName:nameArray[0],
            lastName:nameArray[1],
            password:"desy1234",
            email:profile.emails[0].value,
            googleId:profile.id
        });
        console.log("new user created is",newUser)
        return done(null,newUser);
    }
}));


  // serialize user by storing user in a cookie session
passport.serializeUser(function(user, done) {
    done(null, user.id);
    console.log("serializeUser user", user.id);
  });
  


  // deserialize user cookie to get user id
  passport.deserializeUser(async(id, done) => {
    const user= await authModel.findById(id);
    console.log("deserializeUser user", user);
    done(null,  user);
});

