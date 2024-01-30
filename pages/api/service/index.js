import ConnectDB from "../../../utils/mongodb";
import Services from '../../../model/service';
import auth from '../../../middleware/auth';

ConnectDB()

export default async (req, res) => {
    switch(req.method){
        case 'POST':
            await createService(req, res)
            break;
        case 'GET':
            await getService(req, res)
            break;
    }
}

const createService = async (req, res) => {
    try{
        const result = await auth (req, res)
        if(result.role !== 'admin') return res.status(400).json({err: "Authentication is not valid"})
        
        const {name} = req.body
        if(!name) return res.status(400).json({err: "Timing must be at least 1 character"})

        const newService = new Services({name})

        await newService.save()

        res.json({
            msg: 'Success! Created a new category',
            newService
        })

    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}

const getService = async (req, res) => {
    try{

        const service = await Services.find()

        res.json({service})
    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}