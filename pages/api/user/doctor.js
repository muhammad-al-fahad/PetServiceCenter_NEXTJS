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

        const doctors = await Users.find({role: 'doctor'}).select('-password')

        res.json({doctors})
        
    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}