import ConnectDB from "../../../../utils/mongodb";
import Types from '../../../../model/type';
import auth from '../../../../middleware/auth';

ConnectDB()

export default async (req, res) => {
    switch(req.method){
        case 'POST':
            await createType(req, res)
            break;
        case 'GET':
            await getTypes(req, res)
            break;
    }
}

const createType = async (req, res) => {
    try{
        const result = await auth (req, res)
        if(result.role !== 'admin') return res.status(400).json({err: "Authentication is not valid"})
        
        const {name} = req.body
        if(!name) return res.status(400).json({err: "Name must have 1 character at least"})

        const type = await Types.findOne({name})
        if(type) return res.status(400).json({err: "This type is already available"})

        const newType = new Types({name})

        await newType.save()

        res.json({
            msg: 'Success! Created a new Type',
            newType
        })

    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}

const getTypes = async (req, res) => {
    try{

        const type = await Types.find()

        res.json({type})
    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}