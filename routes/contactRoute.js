import express from "express";
import expressAsyncHandler from "express-async-handler"

const router = express.Router();


import contactUsModel from "../models/contactModel.js";


  //contactUs route
router.post("/contactUs",expressAsyncHandler(async(req,res)=>{
    const {
      name,
      email,
      message
       }=req.body;
  
     try{
      const userDetails = await contactUsModel.create({
        name,
        email,
        message
      });
      res.status(200).json({userDetails});
      console.log({ name,
        email,
        message})
     }catch(err){
         console.log(err)
        //  console.log("err",err.keyPattern.email === 1 && "hey")
         const errors = handleErrors(err);
         res.send({errors});
     }
}))

export default router;