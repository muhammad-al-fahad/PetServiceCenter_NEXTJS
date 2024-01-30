import ConnectDB from "../../../utils/mongodb";
import Users from '../../../model/user';
import auth from '../../../middleware/auth';


ConnectDB()


export default async (req, res) => {
    switch(req.method){
        case 'PATCH':
            await updateRole(req, res)
            break;
        case 'DELETE':
            await delUser(req, res)
            break;
        case 'GET':
            await getUserId(req, res)
            break;
    }
}

const updateRole = async (req, res) => {
    try{
        const result = await auth (req, res)
        if(result.role !== 'admin' || !result.root) 
            return res.status(400).json({err: "Authentication is not valid"})

        const {id} = req.query
        const {role} = req.body

        await Users.findOneAndUpdate({_id: id}, {role})
        res.json({msg: 'Update Success!'})
         
    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}

const delUser = async (req, res) => {
    try{
        const result = await auth (req, res)
        if(result.role !== 'admin' || !result.root) 
            return res.status(400).json({err: "Authentication is not valid"})

        const {id} = req.query

        await Users.findOneAndDelete({_id: id})
        res.json({msg: 'Deleted SuccessFull!'})
         
    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}

const getUserId = async (req, res) => {
    try{

        const {id} = req.query

        const user = await Users.findOne({_id: id})
        res.json({user})
         
    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}