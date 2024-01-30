import ConnectDB from "../../../../utils/mongodb";
import Types from '../../../../model/type';
import auth from '../../../../middleware/auth';

ConnectDB()

export default async (req, res) => {
    switch(req.method){
        case 'PUT':
            await updateType(req, res)
            break;
        case 'DELETE':
            await delType(req, res)
            break;
        case 'GET':
            await getType(req, res)
            break;
    }
}

const updateType = async (req, res) => {
    try{

        const result = await auth(req, res)
        if(result.role !== 'admin') return res.status(400).json({err: "Authentication is not valid"})

        const {id} = req.query
        const {name} = req.body

        const newType = await Types.findOneAndUpdate({_id: id}, {name})
        res.json({
            msg: "Success! Update a current Type",
            type: {
                ...newType._doc,
                name
            }
        })

    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}

const delType = async (req, res) => {
    try{
        
        const result = await auth(req, res)
        if(result.role !== 'admin') return res.status(400).json({err: "Authentication is not valid"})

        const {id} = req.query

        await Types.findByIdAndDelete(id)
        res.json({msg: `Success! Deleted a current Type`})

    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}