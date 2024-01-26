import mongoose from 'mongoose'

const connectDB = async()=>{
  try{
      const conn=await mongoose.connect(process.env.DATABASE_URL)
      console.log(`MongoDB CONNECTED  :${conn.connection.host}`.cyan.underline.bold)
      }catch(err){
        console.log(`THERE IS AN ERROR IN CONNECTING TO MONGO DB: ${err}`.red)
      }

}

export default connectDB;