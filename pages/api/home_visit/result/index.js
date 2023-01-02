import ConnectDB from "../../../../utils/mongodb";
import Result from '../../../../model/home_visit/result';
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
            user,
            appoint,
            service,
            guidence
        } = req.body

    if(
        !appoint ||
        !user ||
        service === 'all' ||
        !guidence
        )
            return res.status(400).json({err: "Please fill all the fields"})

        const newresult = new Result({
            doctor: result.id,
            appointment: appoint,
            user,
            service,
            guidence
        })

        await newresult.save()

        res.json({
            msg: "Success! Created a Home Visit Result",
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
        
        let home_visit;
        if(result.role === 'doctor'){
            home_visit = await Result.find({doctor: result.id})
        }else if(result.role !== 'operator'){
            home_visit = await Result.find({user: result.id})
        }

       res.json({home_visit})
    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}