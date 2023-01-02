import ConnectDB from "../../../utils/mongodb";
import Users from '../../../model/user';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

ConnectDB()

const Reset = async (req, res) => {
    switch(req.method){
        case "POST":
            await reset(req, res)
            break;
    }
}

const reset = async (req, res) => {
    try{
        const { password, confirm_password, access_token} = req.body

        const user = jwt.verify(access_token, process.env.ACCESS_TOKEN)
        
        const {id} = user
        if(!password || !confirm_password)
            return res.status(400).json({err: "Please Fill All The Fields"})

        if(password.length < 8)
           return res.status(400).json({err: "Password Must be At least of 8 characters"})

        if(password !== confirm_password)
            return res.status(400).json({err: "Password is not match"})

        const passwordHash = await bcrypt.hash(password, 12)

        await Users.findOneAndUpdate({_id: id}, {
         password: passwordHash, confirm_password
        })

        res.json({msg: "Password SuccessFully Changed"})

    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}

export default Reset