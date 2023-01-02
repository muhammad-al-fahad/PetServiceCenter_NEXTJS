import ConnectDB from "../../../utils/mongodb";
import Timing from '../../../model/timing';
import auth from '../../../middleware/auth';

ConnectDB()

export default async (req, res) => {
    switch(req.method){
        case 'POST':
            await createTiming(req, res)
            break;
        case 'GET':
            await getTiming(req, res)
            break;
    }
}

const createTiming = async (req, res) => {
    try{
        const result = await auth (req, res)
        if(result.role !== 'admin') return res.status(400).json({err: "Authentication is not valid"})
        
        const {name} = req.body
        if(!name) return res.status(400).json({err: "Timing must be at least 1 character"})

        const newTiming = new Timing({name})

        await newTiming.save()

        res.json({
            msg: 'Success! Created a new category',
            newTiming
        })

    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}

const getTiming = async (req, res) => {
    try{

        const timing = await Timing.find()

        res.json({timing})
    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}