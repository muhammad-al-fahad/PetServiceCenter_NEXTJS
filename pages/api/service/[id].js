import ConnectDB from "../../../utils/mongodb";
import Services from '../../../model/service';
import auth from '../../../middleware/auth';

ConnectDB()

export default async (req, res) => {
    switch(req.method){
        case 'PUT':
            await updateService(req, res)
            break;
        case 'DELETE':
            await delService(req, res)
            break;
    }
}

const updateService = async (req, res) => {
    try{

        const result = await auth(req, res)
        if(result.role !== 'doctor') return res.status(400).json({err: "Authentication is not valid"})

        const {id} = req.query
        const {name} = req.body

        const newService = await Services.findOneAndUpdate({_id: id}, {name})

        res.json({
            msg: "Success! Update a current Service",
            service: {
                ...newService._doc,
                name
            }
        })

    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}

const delService = async (req, res) => {
    try{
        
        const result = await auth(req, res)
        if(result.role !== 'admin') return res.status(400).json({err: "Authentication is not valid"})

        const {id} = req.query

        await Services.findByIdAndDelete(id)
        res.json({msg: "Success! Deleted a current Service"})

    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}