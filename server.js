import  express from "express";
import colors  from "colors";
import dotenv  from "dotenv";
import morgan  from "morgan";
import cookieParser  from "cookie-parser";
import cors from "cors"
import passport from "passport"
import session from "express-session";


const app = express();


const origin = "http://127.0.0.1:5501" 

import  "./utils/passport.js"
import authRoute  from "./routes/authRoute.js";
import userInforRoute  from "./routes/userInforRoute.js";
import connectDB  from "./db.js";


// Load environment variables from .env file
dotenv.config();
//connecting the db
connectDB();
// Using morgan middleware to log HTTP requests
app.use(morgan('dev'));
// Using cookie-parser middleware to parse cookies
app.use(cookieParser());
//parsing json response
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
// Enable CORS for all routess
app.use(
  cors(
    {
    origin,
    credentials:true}
  )
  );

  app.use(session({
    secret:process.env.COOKIE_SECRET, // Change this to a strong and secret key
    resave:true,
    saveUninitialized:true,
  }))
  app.use(passport.initialize())
  app.use(passport.session())


  app.use("/api/auth",authRoute);
  app.use("/api/registration-portal",userInforRoute);

//initial route  i.e root route
app.get('/', (req, res) => { 
    res.send("Api running")
})

//displaying error message on unknown route
app.use((err,req,res,next)=>{
    res.status(500).send({message:err.message})
  })

// Set the PORT for our app to have access to it. If no env has been set, we hard code it to 5005
const PORT = process.env.PORT || 5000;

//Listening to requests
app.listen(PORT,() => {
    console.log(
        `Express server is running in the ${process.env.NODE_ENV} mode at http://localhost:${PORT} 🚀`
          .yellow.bold
      );
})