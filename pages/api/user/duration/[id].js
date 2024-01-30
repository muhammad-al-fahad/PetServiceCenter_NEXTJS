import ConnectDB from "../../../../utils/mongodb";
import Users from '../../../../model/user';

ConnectDB()

export default async (req, res) => {
    switch(req.method){
         case 'PUT':
            await updateUser(req, res)
            break;
    }
}

const updateUser = async (req, res) => {
    try{

        const {id} = req.query
        const {duration, paid} = req.body

        await Users.findOneAndUpdate({_id: id}, {
            duration, paid, role: 'user', membership: 'Null'
        })
    }
   catch(err) {
        return res.status(500).json({err: err.message})
    }
}