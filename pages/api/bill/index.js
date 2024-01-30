import ConnectDB from "../../../utils/mongodb";
import Bill from '../../../model/bill';
import Appointment from '../../../model/appointment';
import auth from '../../../middleware/auth';

ConnectDB()

const BillIndex = async (req, res) => {
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
        const authorizaton = await auth (req, res)
        if(authorizaton.role !== 'operator') return res.status(400).json({err: "Authentication is not valid"})
        
        const {appoint, user, doctor, service, result, unit_cost, description, city_per_hour, amount} = req.body

        if(!appoint || !user || !doctor || !service || unit_cost === 0 || !description || result.length === 0 || city_per_hour === 0 || amount === 0)
            return res.status(400).json({err: "Please fill all the fields"})

        const newBill = new Bill({
            operator: authorizaton.id, owner: user, doctor, appointment: appoint, service, result, unit_cost, description, city_per_hour, amount
        })

        await newBill.save()

        await Appointment.findOneAndUpdate({_id: appoint}, {
            bill: true
        })

        res.json({
            msg: 'Success! Bill Generated',
            newBill
        })

    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}

const getData = async (req, res) => {
    try{

        const result = await auth (req, res)

        let bill;
        if(result.role === 'operator'){
            bill = await Bill.find({operator: result.id})
        }else if(result.role === 'user' || result.role === 'membership'){
            bill = await Bill.find({owner: result.id})
        }else{
            bill = await Bill.find({doctor: result.id})
        }

        res.json({bill})
    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}

export default BillIndex