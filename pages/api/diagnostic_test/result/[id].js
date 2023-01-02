import ConnectDB from "../../../../utils/mongodb";
import Result from '../../../../model/diagnostic_test/result';
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
            operator,
            test_type,
            reason_test,
            infection,
            injury,
            fracture,
            disease_type,
            disease_reason
        } = req.body

        if(
            !operator ||
            !test_type ||
            !reason_test ||
            !disease_reason ||
            !disease_type
            )
                return res.status(400).json({err: "Please fill all the fields"})

        await Result.findOneAndUpdate({_id: id}, {
            operator,
            test_type,
            reason_test,
            infection,
            injury,
            fracture,
            disease_type,
            disease_reason
        })

        res.json({msg: 'Success! Updated a Diagnostic Test Result'})
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

       res.json({msg: `Success! Deleted the Diagnostic Test Result`})
    }
   catch(err) {
        return res.status(500).json({err: err.message})
    }
}