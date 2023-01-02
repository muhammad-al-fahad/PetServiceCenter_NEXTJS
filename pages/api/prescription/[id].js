import ConnectDB from "../../../utils/mongodb";
import Prescription from '../../../model/prescription';
import Category from '../../../model/medicine';
import auth from '../../../middleware/auth'

ConnectDB()

export default async (req, res) => {
    switch(req.method){
        case 'GET':
            await getData(req, res)
            break;
         case 'PUT':
            await updateData(req, res)
            break;
        case 'DELETE':
            await delData(req, res)
            break;
    }
}

const getData = async (req, res) => {
    try{
        const {id} = req.query

        const prescription = await Prescription.findById(id)

        res.json({prescription})
    }
   catch(err) {
        return res.status(500).json({err: err.message})
    }
}

const updateData = async (req, res) => {
    try{
        const result = await auth(req, res)
        if(result.role !== 'doctor') return res.status(400).json({err: "Authentication is not valid"})

        const {id} = req.query
        const {operator, product, repeat, no_of_repeat_prescription, interval_between_repeat, furthur_information, quantity_in_each_repeat, prescription_expiry_date, total_quantity_to_disease} = req.body

        if(operator === 'all' || product.length === 0 || no_of_repeat_prescription === 0 || interval_between_repeat === 0 || quantity_in_each_repeat === 0 || !furthur_information || !prescription_expiry_date || total_quantity_to_disease === 0)
            return res.status(400).json({err: "Please fill all the fields"})

        const pres = await Prescription.findOneAndUpdate({_id: id}, {operator, product, repeat_prescription: repeat, no_of_repeat_prescription, interval_between_repeat, furthur_information, quantity_in_each_repeat, prescription_expiry_date, total_quantity_to_disease})

        pres && product && product.map(async (pro) => {
            await Category.findOneAndDelete({_id: pro._id})
        })

        res.json({msg: 'Success! Updated a Physical Examination'})
    }
   catch(err) {
        return res.status(500).json({err: err.message})
    }
}

const delData = async (req, res) => {
    try{
        const result = await auth(req, res)
        if(result.role !== 'doctor') return res.status(400).json({err: "Authentication is not valid"})

        const {id} = req.query

        const pres = await Prescription.findOne({_id: id})

        pres && pres.product && pres.product.map(async (pro) => {
            await Category.findOneAndDelete({_id: pro._id})
        })
       
        await Prescription.findByIdAndDelete(id)

    

        res.json({msg: `Success! Deleted the Prescription`})
    }
   catch(err) {
        return res.status(500).json({err: err.message})
    }
}