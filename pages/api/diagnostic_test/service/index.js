import ConnectDB from "../../../../utils/mongodb";
import Service from '../../../../model/diagnostic_test/service';
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

       const {appoint, purpose, test, physician_test, cardiology_test, neptrology_test, signs_pet} = req.body

       if(!purpose || signs_pet.length === 0 || !physician_test || !cardiology_test || !neptrology_test || !test)
            return res.status(400).json({err: "Please fill all the fields"})

        const newservice = new Service({appointment: appoint, purpose, physician_test, cardiology_test, neptrology_test, signs_pet, test})

        await newservice.save()

        res.json({
            msg: "Success! Created a Diagnostic Test Service",
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