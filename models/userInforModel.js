import mongoose from "mongoose"
import validator from 'validator';



const userInforSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: [true, "Enter your fullName"],
    },
    gender:{
        type: String,
        required: [true, "Enter your gender"],
    },
    dob:{
        type: String,
        required: [true, "Enter your date of birth"],
    },
    nationality: {
        type: String,
        required: [true, "Enter your nationality"],
      },
    phoneNumber:{
      type: String,
      sparse: true, // Allows null or unique values
      index: true, 
      unique: true,
      required: [true, "Enter your phone number"],
    },
   email:{
    type: String,
    required: [true, "Enter your email"],
    sparse: true, // Allows null or unique values
    unique: true,
    validate: [validator.isEmail, "Enter a correct email"],
   },
  residence:{
    type: String,
    required: [true, "Enter your residence"],
},
tech_stacks:{
    type: String,
    required: [true, "Enter your tech_stacks"],
},
prog_experience:{
    type: String,
    required: [true, "Enter your pro_experience"],
},
job_availability:{
    type: String,
    required: [true, "Enter your job_availability"],
},
file:{
    type: String,
    required: [true, "Enter your file"],
},
checkbox:{
    type: String,
},
user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"users",
    require:true
},

  },{
    timestamps:true
  });


export default mongoose.model('usersInfor',userInforSchema)

