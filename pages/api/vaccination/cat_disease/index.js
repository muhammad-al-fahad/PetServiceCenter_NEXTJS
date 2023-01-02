import ConnectDB from "../../../../utils/mongodb";
import Result from '../../../../model/vaccination/cat_disease';
import auth from '../../../../middleware/auth';

ConnectDB()

export default async (req, res) => {
    switch(req.method){
        case 'POST':
            await createData(req, res)
            break;
        case 'GET':
            await getData(req, res)
            break;
    }
}

const createData = async (req, res) => {
    try{
       const result = await auth(req, res)
       if(result.role !== 'doctor') return res.status(400).json({err: "Authentication is not valid"})

       const {
            operator,
            user,
            appoint,
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
        !appoint ||
        !operator ||
        !user ||
        distemper === 'all' ||
        rabbies === 'all' || 
        rhinotrachitis === 'all' || 
        leukemia_virus === 'all' ||
        vaccine === 'all' ||
        age_per_week === 0 ||
        !condition ||
        non_core_vaccine === 'all' ||
        type_vaccine === 'all' ||
        core_vaccine === 'all'
        )
            return res.status(400).json({err: "Please fill all the fields"})

        const newresult = new Result({
            doctor: result.id,
            appointment: appoint,
            operator,
            user,
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

        await newresult.save()

        res.json({
            msg: "Success! Created a Cat Disease Vaccination Result",
            newresult
        })
    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}

const getData = async (req, res) => {
    try{
        const result = await auth(req, res)
        
        let vaccination;
        if(result.role === 'doctor'){
            vaccination = await Result.find({doctor: result.id})
        }else if(result.role === 'operator'){
            vaccination = await Result.find({operator: result.id})
        }else {
            vaccination = await Result.find({user: result.id})
        }

       res.json({vaccination})
    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}