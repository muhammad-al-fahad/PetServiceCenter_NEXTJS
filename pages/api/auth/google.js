import ConnectDB from "../../../utils/mongodb";
import Users from '../../../model/user';
import bcrypt from 'bcrypt'
import {createRefreshToken, createAccessToken} from '../../../utils/token'

ConnectDB()

const Google = async (req, res) => {
    switch(req.method){
        case "POST":
            await googleLogin(req, res)
            break;
    }
}

const googleLogin = async (req, res) => {

    try{
        
        const {decode} = req.body

        const {email_verified, email, name, picture} = decode

        const password = email + process.env.GOOGLE_SECRET

        const passwordHash = await bcrypt.hash(password, 12)

        if(!email_verified) 
            return res.status(400).json({err: "Email verification Failed"})

        const user = await Users.findOne({email})

        if(user){
            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch)
                return res.status(400).json({err: "Password is incorrect"})

                const refresh_token = createRefreshToken({id: user._id})
                const access_token = createAccessToken({id: user._id})
      
                res.json({
                    msg: "Login SuccessFully!",
                    refresh_token,
                    access_token,
                    user: {
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        avatar: user.avatar,
                        root: user.root,
                        address: user.address,
                        contact: user.contact,
                        dateofbirth: user.dateofbirth,
                        cnic: user.cnic
                    }
                })

          }else {

             const newUser = new Users({
               name, email, password: passwordHash, avatar: picture
             })
             await newUser.save()

             const refresh_token = createRefreshToken({id: newUser._id})

             const access_token = createAccessToken({id: newUser._id})

             res.json({
                msg: "Login SuccessFully!",
                refresh_token,
                access_token,
                user: {
                    name: newUser.name,
                    email: newUser.email,
                    avatar: newUser.avatar
                }
            })
          }


    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}

export default Google