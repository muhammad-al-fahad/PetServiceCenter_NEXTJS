import ConnectDB from "../../../../utils/mongodb";
import Users from '../../../../model/user';

ConnectDB()

export default async (req, res) => {
    switch(req.method){
         case 'PUT':
            await updateMember(req, res)
            break;
    }
}

const updateMember = async (req, res) => {
    try{
        const {duration, token} = req.body

        await Users.findOneAndUpdate({_id: token}, {
            duration
        })
    }
   catch(err) {
        return res.status(500).json({err: err.message})
    }
}