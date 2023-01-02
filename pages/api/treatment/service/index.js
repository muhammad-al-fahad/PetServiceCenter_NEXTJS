import ConnectDB from "../../../../utils/mongodb";
import Service from '../../../../model/treatment/service';
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
       if(result.role !== 'user' && result.role !== 'membership') return res.status(400).json({err: "Authentication is not valid"})

       const {appoint, complain, food, water, vomitting, sneezing, nasal, coughing, occular, dehydration, temperature, crt, mucus_membrane, facal, urine} = req.body

       if(!complain || temperature.length === 0 || dehydration === 0 || !crt || !mucus_membrane || !facal || !urine)
            return res.status(400).json({err: "Please fill all the fields"})

        const newservice = new Service({appointment: appoint, complain, food, water, vomitting, sneezing, nasal, coughing, occular, temperature, dehydration, crt, mucus_membrane, facal, urine})

        await newservice.save()

        res.json({
            msg: "Success! Created a Treatment Service",
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