import ConnectDB from "../../../../utils/mongodb";
import Result from '../../../../model/vaccination/cat_disease';
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
            distemper,
            rabbies,
            rhinotrachitis,
            leukemia_virus,
            age_per_week,
            vaccine,
            type_vaccine,
            core_vaccine,
            non_core_vaccine,
            condition
        } = req.body

        if(
            !operator ||
            distemper === 'all' ||
            rabbies === 'all' || 
            rhinotrachitis === 'all' || 
            leukemia_virus === 'all' |
            vaccine === 'all' ||
            age_per_week === 0 ||
            !condition ||
            non_core_vaccine === 'all' ||
            type_vaccine === 'all' ||
            core_vaccine === 'all'
            )
                return res.status(400).json({err: "Please fill all the fields"})

        await Result.findOneAndUpdate({_id: id}, {
            operator,
            distemper,
            rabbies,
            rhinotrachitis,
            leukemia_virus,
            age_per_week,
            vaccine,
            type_vaccine,
            core_vaccine,
            non_core_vaccine,
            condition
        })

        res.json({msg: 'Success! Updated a Cat Disease Vaccination Result'})
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

       res.json({msg: `Success! Deleted the Cat Disease Vaccination Result`})
    }
   catch(err) {
        return res.status(500).json({err: err.message})
    }
}