import ConnectDB from "../../../utils/mongodb";
import Bill from '../../../model/bill';
import auth from '../../../middleware/auth';

ConnectDB()

const BillId = async (req, res) => {
    switch(req.method){
        case 'PATCH':
            await updateData(req, res)
            break;
        case 'DELETE':
            await delData(req, res)
            break;
        case 'GET':
            await getDataId(req, res)
            break;
    }
}

const updateData = async (req, res) => {
    try{
        const user = await auth (req, res)
        if(user.role !== 'operator') return res.status(400).json({err: "Authentication is not valid"})

        const {id} = req.query
        const {appoint, service, result, unit_cost, description, city_per_hour, amount} = req.body

        if(!appoint || !service || unit_cost === 0 || !description || result.length === 0 || city_per_hour === 0 || amount === 0)
            return res.status(400).json({err: "Please fill all the fields"})

        await Bill.findOneAndUpdate({_id: id}, {
            appointment: appoint, service, result, unit_cost, description, city_per_hour, amount
        })

        res.json({msg: `Success! Update a Bill`})

    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}

const delData = async (req, res) => {
    try{
        const result = await auth (req, res)
        const {id} = req.query

        const bill = await Bill.findByIdAndDelete(id)

        await Appointment.findByOneAndUpdate({_id:  bill.appointment}, {
            bill: false
        })

        res.json({msg: "Success! Deleted a Bill"})

    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}

const getDataId = async (req, res) => {
    try{

        const {id} = req.query

        const bill = await Bill.findById(id)
        res.json({bill})

    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}

export default BillId