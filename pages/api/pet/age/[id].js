import ConnectDB from "../../../../utils/mongodb";
import Pets from '../../../../model/pet';

ConnectDB()

export default async (req, res) => {
    switch(req.method){
         case 'PUT':
            await updatePet(req, res)
            break;
    }
}

const updatePet = async (req, res) => {
    try{

        const {id} = req.query
        const {age} = req.body

        if(age === 0)
            return res.status(400).json({err: "No Age"})

        await Pets.findOneAndUpdate({_id: id}, {
            age
        })
    }
   catch(err) {
        return res.status(500).json({err: err.message})
    }
}