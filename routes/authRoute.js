
import express from "express";
import expressAsyncHandler from "express-async-handler"
import passport from "passport";


const router = express.Router();


import authModel from "../models/authModel.js"
import {data} from "../data/userData.js"
import {createToken} from "../utils/generateToken.js"


const handleErrors = (err) => {
  
  // console.log("handleErrors",err.message, err.code);
     let errors= {
    fullName: "",
    email: "",
    password: "",
    errMessage:""
  };

  // login error :incorrect email
  if (err.message === "incorrect email") {
    errors.email = "That email is not registered";
    return errors;
  }
  
  //login error : incorrect password
  if (err.message === "incorrect password") {
    errors.password = "The password is incorrect ";
    return errors;
  }

  // duplicate email error
  if (err.code === 11000 && err.keyPattern.email === 1 ) {
    errors.email = "This email has already been registered";
    return errors;
  }

  // signup validation errors
  if (err.message.includes("users validation failed")) {
    // console.error(err)
    // console.error(Object.values(err.errors))
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};



router.get("/seed",expressAsyncHandler(async(req,res)=>{
  const userCred = await authModel.insertMany(data.Users);
  res.send({userCred});
}))


//signup email, password route
router.post("/register",expressAsyncHandler(async(req,res)=>{
    const {firstName,lastName,email,password}=req.body;
  
     try{
      const user = await authModel.create({
        firstName,
        lastName,
        email,
        password,
      });
      res.status(200).json({user});
      console.log({fullName,email,password});
     }catch(err){
         console.log(err)
        //  console.log("err",err.keyPattern.email === 1 && "hey")
         const errors = handleErrors(err);
         res.send({errors});
     }
}))



    //signIn route
  router.post("/sign-in",expressAsyncHandler(async(req,res)=>{
    const {email,password} = req.body;

    if (!email) return sendError(res, "Enter your email");
  
    if (!password) return sendError(res, "Enter your password");
    
    try{
      // console.log(email,password)
          const user = await authModel.login(email, password);

          // const token = createToken(user);
          res.status(200).send({
            id:user._id,
            fullName:user.fullName,
            email:user.email,
            // token 
            });
      }catch(err){
      console.log("err",err)
      const errors = handleErrors(err);
      res.status(401).send({ errors });
      console.log(errors)
      }
  }))



   //Signin and Signup with Google Account
   router.get("/google/login/success",expressAsyncHandler(async function(req,res){
    if(req.user){
      const token = createToken(user);
      res.status(200).send({
            error:false,
            message:"Successfully logged in",
            user:req.user,
            token
      })

      console.log("console user", {user:req.user})
    }else{
      res.status(403).send({error:true,message:"Not Authorized"});
      console.log("Not Authorized")
    }
  
}))


router.get("/google/login/failed",expressAsyncHandler(async function(req,res){
   res.status(401).send({
    error:true,
    message:"log in failure"
   })
}))


//route to the consent screen where the profile and email of the user will pop up
router.get("/google",
passport.authenticate("google",["profile","email"])
)

// // Google auth routes
// router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));



// route handles the callback from Google after the user has authenticated.
router.get("/google/callback",
 passport.authenticate("google",{
    successRedirect:process.env.REDIRECT_URL,
    failureRedirect:"/google/login/failed"
}),
);


router.get("/google/logout",(req, res) => {
  req.logout((err) => {
    if (err) {
      res.send({error:err});
    }
    res.send({message:"successfully logged out"});
});
});


  export default router;