import ConnectDB from "../../../../utils/mongodb";
import Service from '../../../../model/checkup/service';
import auth from '../../../../middleware/auth'

ConnectDB()

const ServiceId = async (req, res) => {
    switch(req.method){
         case 'PUT':
            await updateData(req, res)
            break;
        case 'GET':
            await getData(req, res)
            break;
    }
}

const updateData = async (req, res) => {
    try{
        const result = await auth(req, res)
        if(result.role !== 'user' && result.role !== 'membership') return res.status(400).json({err: "Authentication is not valid"})

        const {id} = req.query
        const {body_condition, body_condition_score, behavior, posture, gait, defecation, urination, voice, cough} = req.body

        if(body_condition === 'all' || !body_condition_score ||  behavior === 'all' || posture === 'all' || gait === 'all' || defecation === 'all' || urination === 'all' || voice === 'all' || cough === 'all')
            return res.status(400).json({err: "Please fill all the fields"})

        await Service.findOneAndUpdate({_id: id}, {
            body_condition, body_condition_score, behavior, posture, gait, defecation, urination, voice, cough
        })

        res.json({msg: `Success! Updated a Checkup Service`})
    }
   catch(err) {
        return res.status(500).json({err: err.message})
    }
}

const getData = async (req, res) => {
    try{  
        const {id} = req.query

        const service = await Service.findById(id)

        res.json({service})
    }
   catch(err) {
        return res.status(500).json({err: err.message})
    }
}

export default ServiceId