import ConnectDB from "../../../utils/mongodb";
import Prescription from '../../../model/prescription';
import Category from '../../../model/medicine';
import auth from '../../../middleware/auth';

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

       const {appoint, operator, user, product, repeat, no_of_repeat_prescription, interval_between_repeat, furthur_information, quantity_in_each_repeat, prescription_expiry_date, total_quantity_to_disease} = req.body

       if(!appoint || !user || operator === 'all' || product.length === 0 || no_of_repeat_prescription === 0 || interval_between_repeat === 0 || quantity_in_each_repeat === 0 || !furthur_information || !prescription_expiry_date || total_quantity_to_disease === 0)
            return res.status(400).json({err: "Please fill all the fields"})

        const newPrescription = new Prescription({appointment: appoint, doctor: result.id, operator, user, product, repeat_prescription: repeat, no_of_repeat_prescription, interval_between_repeat, furthur_information, quantity_in_each_repeat, prescription_expiry_date, total_quantity_to_disease})

        await newPrescription.save()

        newPrescription.length !== 0 && product && product.map(async (pro) => {
            await Category.findOneAndDelete({_id: pro._id})
        })

        res.json({
            msg: "Success! Created a Prescription",
            newPrescription
        })
    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}

const getData = async (req, res) => {
    try{
        const result = await auth(req, res)
        
        let prescription;
        if(result.role === 'doctor'){
            prescription = await Prescription.find({doctor: result.id})
        }else if(result.role === 'operator'){
            prescription = await Prescription.find({operator: result.id})
        }else {
            prescription = await Prescription.find({user: result.id})
        }

       res.json({prescription})
    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}