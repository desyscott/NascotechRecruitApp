import bcrypt from "bcrypt";


const salt = await bcrypt.genSalt();

export const data ={
    
      Users:[
        {
          fullName:"DESMOND EDMUND",
          email:"admin1234@gmail.com",
          password:bcrypt.hashSync("Desy1234",salt),
          isAdmin:true,


        },
        {
          fullName:"Barbara Mensah",
          email:"mrfallback055@gmail.com",
          password:bcrypt.hashSync("Scott12345",salt),
          isAdmin:false,

        },

          ],
}