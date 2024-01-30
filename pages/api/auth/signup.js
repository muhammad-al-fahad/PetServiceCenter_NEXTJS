import ConnectDB from "../../../utils/mongodb";
import Users from '../../../model/user';
import bcrypt from 'bcrypt'
import sendMail from '../../../utils/sendMail'
import { createActivationToken } from '../../../utils/token'

ConnectDB()

const Signup = async (req, res) => {
    switch(req.method){
        case "POST":
            await register(req, res)
            break;
    }
}

const register = async (req, res) => {
    try{
        const baseUrl = process.env.BASE_URL;

        const {name, email, password, confirm_password} = req.body

        const user = await Users.findOne({email})

        if(user)
           return res.status(400).json({err: "This Email Already Existed"})

       const passwordHash = await bcrypt.hash(password, 12)

        const newUser = {name, email, password: passwordHash, confirm_password}

        const activation_token = createActivationToken(newUser)
        
        const url = `${baseUrl}/login/${activation_token}`

        sendMail(email, url)

        res.json({msg: "Registered SuccessFull! Please Activate Your Email"})

    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}

export default Signup