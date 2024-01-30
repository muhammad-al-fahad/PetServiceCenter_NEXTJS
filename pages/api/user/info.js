import ConnectDB from "../../../utils/mongodb";
import Users from '../../../model/user';
import auth from '../../../middleware/auth';


ConnectDB()


export default async (req, res) => {
    switch(req.method){
        case 'PATCH':
            await updateInfo(req, res)
            break;

        case 'GET':
            await getInfo(req, res)
            break;
    }
}

const updateInfo = async (req, res) => {
    try{
        const result = await auth(req, res)
        const {name, avatar, dateofbirth, contact, address, cnic, age, designation, bio} = req.body

        const newUser = await Users.findOneAndUpdate({_id: result.id}, {name, avatar, dateofbirth, contact, address, cnic, age, bio, designation}).select('-password')

        res.json({
            msg: "Update SuccessFull!",
            user: {
                name,
                avatar,
                dateofbirth,
                contact,
                address,
                cnic,
                age,
                email: newUser.email,
                role: newUser.role,
                bio,
                designation
            }
        })
    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}

const getInfo = async (req, res) => {
    try{
        const result = await auth (req, res)
        if(result.role !== 'admin') return res.status(400).json({err: "Authentication is not valid"})

        const users = await Users.find().select('-password')
        res.json({users})
    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}