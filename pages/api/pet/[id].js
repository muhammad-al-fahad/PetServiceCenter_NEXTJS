import ConnectDB from "../../../utils/mongodb";
import Pets from '../../../model/pet';
import petType from '../../../model/petType';
import auth from '../../../middleware/auth';

ConnectDB()

export default async (req, res) => {
    switch(req.method){
         case 'GET':
            await getPetID(req, res)
            break;
         case 'PUT':
            await updatePet(req, res)
            break;
         case 'DELETE':
            await delPet(req, res)
            break; 
    }
}

const getPetID = async (req, res) => {
    try{

        const {id} = req.query

        const pet = await Pets.findById(id)

        const pettype = await petType.findOne({_id: pet.petCategory})

        if(!pet)
                return res.status(400).json({err: "This Pet is not exist"})

        res.json({pet, pettype})
    }
   catch(err) {
        return res.status(500).json({err: err.message})
    }
}

const updatePet = async (req, res) => {
    try{
        const result = await auth(req, res)
        if(result.role !== 'user' && result.role !== 'membership') return res.status(400).json({err: "User must be Login for Updating their Pet's"})

        const {id} = req.query
        const {petName, petSex, petCategory, avatar, dateofbirth, age, bio, disease} = req.body

        if(petCategory === 'all' || !petSex || !petName || avatar.length === 0 || !dateofbirth || !bio || age === 0)
            return res.status(400).json({err: `Please fill the ${!petName ? 'petName' : !petSex ? 'petSex' : !dateofbirth ? 'Birth' : petCategory === 'all' ? 'category' : !bio ? 'Bio' : 'images'} field`})

        await Pets.findOneAndUpdate({_id: id}, {
            petName: petName.toLowerCase(), petCategory, petSex, images: avatar, dateofbirth, age, bio, disease
        })

        res.json({msg: `Success! Updated a ${petName} Pet`})
    }
   catch(err) {
        return res.status(500).json({err: err.message})
    }
}

const delPet = async (req, res) => {
    try{
       const result = await auth(req, res)
       if(result.role !== 'user' && result.role !== 'membership') return res.status(400).json({err: "Authentication is not valid"})

       const {id} = req.query

       const pet = await Pets.findById(id)

       const pettype = await petType.findOne({_id: pet.petCategory})

       if(!pettype) res.status()

       if(result.email !== pet.userDetail[0].email) return res.status(400).json({err: "User does not match with Pet Owner"})
       
       const delpet = await Pets.findByIdAndDelete(id)

       res.json({msg: `Success! Deleted the ${delpet.petName}`})
    }
   catch(err) {
        return res.status(500).json({err: err.message})
    }
}