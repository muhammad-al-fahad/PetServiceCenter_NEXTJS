import ConnectDB from "../../../utils/mongodb";
import Category from '../../../model/medicine';
import auth from '../../../middleware/auth';

ConnectDB()

export default async (req, res) => {
    switch(req.method){
        case 'PUT':
            await updateCategory(req, res)
            break;
        case 'DELETE':
            await delCategory(req, res)
            break;
    }
}

const updateCategory = async (req, res) => {
    try{

        const result = await auth(req, res)
        if(result.role !== 'doctor') return res.status(400).json({err: "Authentication is not valid"})

        const {id} = req.query
        const {proname, prostrength, proquantity, prodose, proinstruction} = req.body

        if(!proname || prostrength === 0 || proquantity === 0 || prodose === 0 || !proinstruction) return res.status(400).json({err: "Please fill all the fields"})

        const newCategory = await Category.findOneAndUpdate({_id: id}, {product_name: proname, product_strength: prostrength, product_quantity: proquantity, product_dose: prodose, product_instruction: proinstruction})
        res.json({
            msg: "Success! Update a current Medicine",
            category: {
                ...newCategory._doc,
                product_name: proname, product_strength: prostrength, product_quantity: proquantity, product_dose: prodose, product_instruction: proinstruction
            }
        })

    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}

const delCategory = async (req, res) => {
    try{
        
        const result = await auth(req, res)
        if(result.role !== 'doctor') return res.status(400).json({err: "Authentication is not valid"})

        const {id} = req.query

        await Category.findByIdAndDelete(id)
        res.json({msg: "Success! Deleted a current medicine"})

    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}