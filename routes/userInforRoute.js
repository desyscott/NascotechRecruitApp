
import express from "express";
import expressAsyncHandler from "express-async-handler"

const router = express.Router();

import userInforModel from "../models/userInforModel.js"


const handleErrors = (err) => {
    // console.log("handleErrors",err.message, err.code);
    
       let errors= {
      fullName: "",
      gender: "",
      dob: "",
      email: "",
      phoneNumber:"",
      nationality: "",
      file: "",
      errMessage:""
    };
  
  
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
    if (err.message.includes("users validation failed")) {
      // console.error(err)
      // console.error(Object.values(err.errors))
      Object.values(err.errors).forEach(({ properties }) => {
        errors[properties.path] = properties.message;
      });
    }
    return errors;
  };


  //signup email, password route
router.post("/register",expressAsyncHandler(async(req,res)=>{
    const {
      fullName,
      gender,
      dob,
      nationality
      ,phoneNumber,
      email,
      residence,
      tech_stacks,
      prog_experience,
      job_availability,
      file,
      checkbox
       }=req.body;
  
     try{
      const userDetails = await userInforModel.create({
        fullName,
        gender,
        dob,
        nationality,
        phoneNumber,
        email,
        residence,
        tech_stacks,
        prog_experience,
        job_availability,
        file,
        checkbox
      });
      res.status(200).json({userDetails});
      console.log({fullName,gender,dob,nationality,phoneNumber,email,residence,tech_stacks,prog_experience,job_availability,checkbox})
     }catch(err){
         console.log(err)
        //  console.log("err",err.keyPattern.email === 1 && "hey")
         const errors = handleErrors(err);
         res.send({errors});
     }
}))

export default router;