import ConnectDB from "../../../utils/mongodb";
import Users from '../../../model/user';
import auth from '../../../middleware/auth';


ConnectDB()


export default async (req, res) => {
    switch(req.method){
        case 'GET':
            await getInfo(req, res)
            break;
    }
}

const getInfo = async (req, res) => {
    try{
        const result = await auth (req, res)
        if(result.role !== 'doctor') return res.status(400).json({err: "Authentication is not valid"})

        const operators = await Users.find({role: 'operator'}).select('-password')

        res.json({operators})
    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}