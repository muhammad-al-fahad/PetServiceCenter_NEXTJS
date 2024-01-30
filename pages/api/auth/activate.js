import ConnectDB from "../../../utils/mongodb";
import Users from '../../../model/user';
import jwt from 'jsonwebtoken'

ConnectDB()

const Activate = async (req, res) => {
    switch(req.method){
        case "POST":
            await activate(req, res)
            break;
    }
}

const activate = async (req, res) => {
    try{
        const { activation_token } = req.body

        const user = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN)

        const {name, email, password, confirm_password} = user

        const verify = await Users.findOne({email})

        if(verify)
            return res.status(400).json({err: "This email already existed!"})

        const newUser = new Users({name, email, password, confirm_password})

        await newUser.save()

        res.json({msg: "Account Has Been Activated"})

    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}

export default Activate