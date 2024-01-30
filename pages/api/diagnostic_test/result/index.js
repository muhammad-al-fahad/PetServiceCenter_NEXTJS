import ConnectDB from "../../../../utils/mongodb";
import Result from '../../../../model/diagnostic_test/result';
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
            test_type,
            reason_test,
            infection,
            injury,
            fracture,
            disease_type,
            disease_reason
        } = req.body

    if(
        !appoint ||
        !operator ||
        !user ||
        !test_type ||
        !reason_test ||
        !disease_reason ||
        !disease_type
        )
            return res.status(400).json({err: "Please fill all the fields"})

        const newresult = new Result({
            doctor: result.id,
            appointment: appoint,
            operator,
            user,
            test_type,
            reason_test,
            infection,
            injury,
            fracture,
            disease_type,
            disease_reason
        })

        await newresult.save()

        res.json({
            msg: "Success! Created a Diagnostic Test Result",
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
        
        let diagnostic_test;
        if(result.role === 'doctor'){
            diagnostic_test = await Result.find({doctor: result.id})
        }else if(result.role === 'operator'){
            diagnostic_test = await Result.find({operator: result.id})
        }else {
            diagnostic_test = await Result.find({user: result.id})
        }

       res.json({diagnostic_test})
    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}