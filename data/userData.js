import bcrypt from "bcrypt";


const salt = await bcrypt.genSalt();

export const data ={
    
      Users:[
        {
          firstName:"EDMUND",
          lastName:"NII ODOI",
          email:"mrfallback055@gmail.com",
          password:bcrypt.hashSync("desy055",salt),
          role:"admin",
          isAdmin:true,
          verified:true,
        },
        {
          firstName:"Barbara",
          lastName:"Mensah",
          email:"admin123@gmail.com",
          password:bcrypt.hashSync("desy123",salt),
          role:"admin",
          isAdmin:true,
          verified:true,
        },

          ],
}