import mongoose from "mongoose"
import validator from 'validator';



const contactUsSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Enter your fullName"],
    },
    message:{
        type: String,
        required: [true, "Enter your gender"],
    },
   email:{
    type: String,
    required: [true, "Enter your email"],
    sparse: true, // Allows null or unique values
    unique: true,
    validate: [validator.isEmail, "Enter a correct email"],
   },

  },{
    timestamps:true
  });


export default mongoose.model('contactUs',contactUsSchema)

