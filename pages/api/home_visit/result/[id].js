import ConnectDB from "../../../../utils/mongodb";
import Result from '../../../../model/home_visit/result';
import auth from '../../../../middleware/auth'

ConnectDB()

export default async (req, res) => {
    switch(req.method){
        case 'GET':
            await getData(req, res)
            break;
        case 'PUT':
            await updateData(req, res)
            break;
        case 'DELETE':
            await delData(req, res)
            break;
    }
}

const getData = async (req, res) => {
    try{
        const {id} = req.query

        const result = await Result.findById(id)

        res.json({result})
    }
   catch(err) {
        return res.status(500).json({err: err.message})
    }
}

const updateData = async (req, res) => {
    try{
        const result = await auth(req, res)
        if(result.role !== 'doctor') return res.status(400).json({err: "Authentication is not valid"})

        const {id} = req.query
        const {
            service,
            guidence
        } = req.body

        if(
            service === 'all' ||
            !guidence
            )
                return res.status(400).json({err: "Please fill all the fields"})

        await Result.findOneAndUpdate({_id: id}, {
            operator,
            service,
            guidence
        })

        res.json({msg: 'Success! Updated a Home Visit Result'})
    }
   catch(err) {
        return res.status(500).json({err: err.message})
    }
}

const delData = async (req, res) => {
    try{
       const result = await auth(req, res)
       if(result.role !== 'doctor') return res.status(400).json({err: "Authentication is not valid"})

       const {id} = req.query
       
       await Result.findByIdAndDelete(id)

       res.json({msg: `Success! Deleted the Home Visit Result`})
    }
   catch(err) {
        return res.status(500).json({err: err.message})
    }
}