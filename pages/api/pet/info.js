import ConnectDB from "../../../utils/mongodb";
import Pets from '../../../model/pet';
import auth from '../../../middleware/auth'

ConnectDB()

export default async (req, res) => {
    switch(req.method){
        case 'GET':
            await getPet(req, res)
            break;
    }
}

const getPet = async (req, res) => {
    try{
       const result = await auth(req, res)
        
       let pet;
       if(result.role === 'user' || result.role === 'membership'){
            pet = await Pets.find({userId: result.id})
       }else {
            pet = await Pets.find()
       }    

       res.json({success: 'Success', result: pet.length, pet})
    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}