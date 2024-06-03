import mongoose from "mongoose"
import validator from 'validator';
import bcrypt from "bcrypt";


const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: [true, "Enter your firstName"],
    },
    lastName:{
        type: String,
        required: [true, "Enter your lastName"],
    },
    email: {
      type: String,
      required: [true, "Enter your email"],
      unique: true,
      validate: [validator.isEmail, "Enter a correct email"],
    },
    password: {
      type: String,
      required: [true, "Enter a password"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    
    isAdmin: {
      type: Boolean,
      default: false,
      required: true,
    },
    googleId: {
      type: String,
      required: true,
    },

  },{
    timestamps:true
  });

    ///hashing the instance of the  password before it is save in the database
       userSchema.pre("save",async function(next){
        try{
            const salt= await bcrypt.genSalt();
            this.password = await bcrypt.hash(this.password,salt);
            next();
           
        }catch(err){
           console.log(err)
        }

       })

    //login
    userSchema.statics.login = async function(email, password){
      const user = await this.findOne({ email });
       // console.log(user);
       if(user){
          const match=await bcrypt.compare(password,user.password);
          if(match){
            return user;
          }
          throw Error("incorrect password");
       }
       throw Error("incorrect email");
    }

    //comparing reset new password  of old password
    userSchema.methods.comparePassword= async function(password){
      try{
        const result = await bcrypt.compare(password,this.password);
        if (result) {
          console.log("result",result);
          return result;
        }
      }catch(err){
        console.log(err);
      }
    }


export default mongoose.model('users',userSchema)

