import ConnectDB from "../../../utils/mongodb";
import Users from '../../../model/user';
import bcrypt from 'bcrypt'
import { createAccessToken, createRefreshToken} from '../../../utils/token'

ConnectDB()

const Login = async (req, res) => {
    switch(req.method){
        case "POST":
            await login(req, res)
            break;
    }
}

const login = async (req, res) => {
    try{
       const {email, password} = req.body

       const user = await Users.findOne({email})
        if(!user)
            return res.status(400).json({err: "This Email is not existed"})

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch)
            return res.status(400).json({err: "Incorrect email / password"})

        const access_token = createAccessToken({id: user._id})

        const refresh_token = createRefreshToken({id: user._id})

        res.json({
            msg: "Login SuccessFull!",
            refresh_token,
            access_token,
            user: {
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

export default Login