import ConnectDB from "../../../utils/mongodb";
import Memberships from '../../../model/membership';
import Types from '../../../model/type';
import auth from '../../../middleware/auth';

ConnectDB()

export default async (req, res) => {
    switch(req.method){
        case 'POST':
            await createMembership(req, res)
            break;
        case 'GET':
            await getMembership(req, res)
            break;
    }
}

const createMembership = async (req, res) => {
    try{
       const result = await auth(req, res)
       if(result.role !== 'admin') return res.status(400).json({err: "Authentication is not valid"})

       const {title, image, category, price, description, types, day} = req.body

       if(category === 'all' || !title || !description || image.length === 0 || price === 0 || types.length === 0 || day === 'all')
            return res.status(400).json({err: "Please fill all the fields"})

        const member = await Memberships.findOne({category})
        
        if(member && member.category){

            types.map(async (type) => {
                await Types.findOneAndDelete({_id: type._id})
            })
            return res.status(400).json({err: `Not Dublicate ${member.category} Membership are allowed`})

        }else{

        const newMember = new Memberships({title, image, description, category, price, types, day})

        await newMember.save()

        newMember.length !== 0 && types && types.map(async (type) => {
            await Types.findOneAndDelete({_id: type._id})
        })

        res.json({
            msg: "Success! Created a new Membership",
            newMember
        })
        
      }
    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}

const getMembership = async (req, res) => {
    try{
        
        const member = await Memberships.find()

       res.json({success: 'Success! Access Membership', result: member.length, member})
    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}