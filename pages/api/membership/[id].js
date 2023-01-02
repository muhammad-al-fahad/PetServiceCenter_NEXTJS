import ConnectDB from "../../../utils/mongodb";
import Memberships from '../../../model/membership';
import Types from '../../../model/type';
import auth from '../../../middleware/auth'

ConnectDB()

export default async (req, res) => {
    switch(req.method){
         case 'GET':
            await getMemberID(req, res)
            break;
         case 'PUT':
            await updateMember(req, res)
            break;
         case 'DELETE':
            await delMember(req, res)
            break; 
    }
}

const getMemberID = async (req, res) => {
    try{
        const {id} = req.query

        const member = await Memberships.findById(id)

        if(!member)
                return res.status(400).json({err: "This Offer is not existed"})

        res.json({member})
    }
   catch(err) {
        return res.status(500).json({err: err.message})
    }
}

const updateMember = async (req, res) => {
    try{
        const result = await auth(req, res)
        if(result.role !== 'admin') return res.status(400).json({err: "Authentication is not valid"})

        const {id} = req.query
        const {title, image, category, price, description, types} = req.body

        if(category === 'all' || !title || !description || image.length === 0 || price === 0 || types.length === 0)
            return res.status(400).json({err: "Please fill all the fields"})

        const member = await Memberships.findOneAndUpdate({_id: id}, {
            title, image, description, category, duration, price, types
        })

        member && types && types.map(async (type) => {
            await Types.findOneAndDelete({_id: type._id})
        })

        res.json({msg: `Success! Updated a ${title} Membership`})
    }
   catch(err) {
        return res.status(500).json({err: err.message})
    }
}

const delMember = async (req, res) => {
    try{
       const result = await auth(req, res)
       if(result.role !== 'admin') return res.status(400).json({err: "Authentication is not valid"})

       const {id} = req.query

       const members = await Memberships.findOne({_id: id})

        members && members.types && members.types.map(async (mem) => {
            await Types.findOne({_id: mem._id})
        })
       
       const member = await Memberships.findByIdAndDelete(id)

       res.json({msg: `Success! Deleted the ${member.title} Membership`})
    }
   catch(err) {
        return res.status(500).json({err: err.message})
    }
}