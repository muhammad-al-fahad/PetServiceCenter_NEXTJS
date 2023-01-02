import ConnectDB from "../../../../utils/mongodb";
import Service from '../../../../model/treatment/service';
import auth from '../../../../middleware/auth'

ConnectDB()

export default async (req, res) => {
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
        const {complain, food, water, vomitting, sneezing, nasal, coughing, occular, dehydration, temperature, crt, mucus_membrane, facal, urine} = req.body

        if(!complain || temperature.length === 0 || dehydration === 0 || !crt || !mucus_membrane || !facal || !urine)
            return res.status(400).json({err: "Please fill all the fields"})

        await Service.findOneAndUpdate({_id: id}, {
            complain, food, water, vomitting, sneezing, nasal, coughing, occular, temperature, dehydration, crt, mucus_membrane, facal, urine
        })

        res.json({msg: `Success! Updated a Treatment Service`})
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