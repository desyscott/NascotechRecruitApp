
import express from "express";
import expressAsyncHandler from "express-async-handler"
import passport from "passport";


const router = express.Router();


import authModel from "../models/authModel.js"
import {data} from "../data/userData.js"



const handleErrors = (err) => {
  
  // console.log("handleErrors",err.message, err.code);
  
     let errors= {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber:"",
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

  // duplicate phoneNumber error
  if (err.code === 11000 && err.keyPattern.phoneNumber === 1) {
    errors.phoneNumber = "This number has already been registered";
    return errors;
  }

//email not verify error
  if (err.message === "Email has not been verified check your inbox") {
    errors.emailVerifyMessage = "Email has not been verified check your inbox";
    return errors;
  }

  // signup validation errors
  if (err.message.includes("User validation failed")) {
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
router.post("/signup",expressAsyncHandler(async(req,res)=>{
    const {firstName,lastName,email,phoneNumber,password}=req.body;
  
     try{
      // const user = await authModel.create({
      //   firstName,
      //   lastName,
      //   phoneNumber,
      //   email,
      //   password
      // });
  
    //   res.status(200).json({user});
      // res.status(200).json( {firstName,lastName,phoneNumber,email,password});
      console.log({firstName,lastName,phoneNumber,email,password})
     }catch(err){
         console.log(err.message)
        //  console.log("err",err.keyPattern.email === 1 && "hey")
         const errors = handleErrors(err);
         res.send({errors});
     }
}))



    //signIn route
  router.post("/signin",expressAsyncHandler(async(req,res)=>{yarn

    if (!email) return sendError(res, "Enter your email");
  
    if (!password) return sendError(res, "Enter your password");
    
    try{
          const user = await authModel.login(email, password);

          const token = createToken(user);
          res.status(200).send({
            id:user._id,
            firstName:user.firstName,
            lastName:user.lastName,
            email:user.email,
            token 
            });
      }catch(err){
      console.log(err)
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

//callback route for google to redirect after the profile information is extracted from the code
router.get("/google/callback",
 passport.authenticate("google",{
    successRedirect:process.env.CLIENT_URL,
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