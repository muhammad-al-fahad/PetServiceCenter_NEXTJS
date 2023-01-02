import ConnectDB from "../../../utils/mongodb";
import Timing from '../../../model/timing';
import auth from '../../../middleware/auth';

ConnectDB()

export default async (req, res) => {
    switch(req.method){
        case 'PUT':
            await updateTiming(req, res)
            break;
        case 'DELETE':
            await delTiming(req, res)
            break;
    }
}

const updateTiming = async (req, res) => {
    try{

        const result = await auth(req, res)
        if(result.role !== 'admin') return res.status(400).json({err: "Authentication is not valid"})

        const {id} = req.query
        const {name} = req.body

        const newTiming = await Timing.findOneAndUpdate({_id: id}, {name})

        res.json({
            msg: "Success! Update a current category",
            timing: {
                ...newTiming._doc,
                name
            }
        })

    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}

const delTiming = async (req, res) => {
    try{
        
        const result = await auth(req, res)
        if(result.role !== 'admin') return res.status(400).json({err: "Authentication is not valid"})

        const {id} = req.query

        await Timing.findByIdAndDelete(id)
        res.json({msg: "Success! Deleted a current timing"})

    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}