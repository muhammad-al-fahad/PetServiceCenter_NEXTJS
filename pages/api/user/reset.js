import ConnectDB from "../../../utils/mongodb";
import Users from '../../../model/user';
import auth from '../../../middleware/auth';
import bcrypt from 'bcrypt'


ConnectDB()


export default async (req, res) => {
    switch(req.method){
        case 'PATCH':
            await resetPassword(req, res)
            break;
    }
}

const resetPassword = async (req, res) => {
     try{
        const result = await auth(req, res)
        const { password } = req.body
        const PHash = await bcrypt.hash(password, 12)

        await Users.findOneAndUpdate({_id: result.id}, {password: PHash})

        res.json({msg: "Update SuccessFull!"})
     }
     catch(err) {
        return res.status(500).json({err: err.message})
     }
}