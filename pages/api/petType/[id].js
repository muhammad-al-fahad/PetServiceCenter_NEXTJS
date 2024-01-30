import ConnectDB from "../../../utils/mongodb";
import petType from '../../../model/petType';
import Pets from '../../../model/pet';
import auth from '../../../middleware/auth';

ConnectDB()

export default async (req, res) => {
    switch(req.method){
        case 'PUT':
            await updateCategory(req, res)
            break;
        case 'DELETE':
            await delCategory(req, res)
            break;
    }
}

const updateCategory = async (req, res) => {
    try{

        const result = await auth(req, res)
        if(result.role !== 'admin') return res.status(400).json({err: "Authentication is not valid"})

        const {id} = req.query
        const {name} = req.body

        const newCategory = await petType.findOneAndUpdate({_id: id}, {name})
        res.json({
            msg: "Success! Update a current category",
            petCategory: {
                ...newCategory._doc,
                name
            }
        })

    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}

const delCategory = async (req, res) => {
    try{
        
        const result = await auth(req, res)
        if(result.role !== 'admin') return res.status(400).json({err: "Authentication is not valid"})

        const {id} = req.query

        await petType.findByIdAndDelete(id)
        res.json({msg: "Success! Deleted a current category"})

    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}