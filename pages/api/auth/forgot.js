import ConnectDB from "../../../utils/mongodb";
import Users from '../../../model/user';
import { createAccessToken } from '../../../utils/token';
import sendMail from '../../../utils/sendMail';

ConnectDB()

const Forgot = async (req, res) => {
    switch(req.method){
        case "POST":
            await forgot(req, res)
            break;
    }
}

const forgot = async (req, res) => {
    try{

        const baseUrl = process.env.BASE_URL;

        const {email} = req.body

        if(!email) return res.status(400).json({err: "Please fill the field"})

        if(!validateEmail(email)) return res.status(400).json({err: "Invalid Email"})
         
        const user = await Users.findOne({email})

        if(!user)
           return res.status(400).json({err: "This email does not exist!"})

        const access_token = createAccessToken({id: user._id})

        const url = `${baseUrl}/password/${access_token}`

        sendMail(email, url)

        res.json({
            msg: "Check Your Email! Send the reset passowrd form.",
            access_token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                root: user.root
            }
        })

    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}

const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

export default Forgot