import ConnectDB from "../../../../utils/mongodb";
import Service from '../../../../model/checkup/service';
import auth from '../../../../middleware/auth';

ConnectDB()

const ServiceIndex = async (req, res) => {
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
       if(result.role !== 'user' && result.role !== 'membership') return res.status(400).json({err: "Authentication is not valid"})

       const {appoint, body_condition, body_condition_score, behavior, posture, gait, defecation, urination, voice, cough} = req.body

       if(body_condition === 'all' || !body_condition_score ||  behavior === 'all' || posture === 'all' || gait === 'all' || defecation === 'all' || urination === 'all' || voice === 'all' || cough === 'all')
            return res.status(400).json({err: "Please fill all the fields"})

        const newservice = new Service({appointment: appoint, body_condition, body_condition_score, behavior, posture, gait, defecation, urination, voice, cough})

        await newservice.save()

        res.json({
            msg: "Success! Created a Checkup Service",
            newservice
        })
    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}

const getData = async (req, res) => {
    try{
        const result = await auth(req, res)
        
        const service = await Service.find()

       res.json({service})
    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}

export default ServiceIndex