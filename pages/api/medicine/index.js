import ConnectDB from "../../../utils/mongodb";
import Category from '../../../model/medicine';
import auth from '../../../middleware/auth';

ConnectDB()

export default async (req, res) => {
    switch(req.method){
        case 'POST':
            await createCategory(req, res)
            break;
        case 'GET':
            await getCategory(req, res)
            break;
    }
}

const createCategory = async (req, res) => {
    try{
        const result = await auth (req, res)
        if(result.role !== 'doctor') return res.status(400).json({err: "Authentication is not valid"})
        
        const {proname, prostrength, proquantity, prodose, proinstruction} = req.body
        if(!proname || prostrength === 0 || proquantity === 0 || prodose === 0 || !proinstruction) return res.status(400).json({err: "Please fill all the fields"})

        const newCategory = new Category({product_name: proname, product_strength: prostrength, product_quantity: proquantity, product_dose: prodose, product_instruction: proinstruction})

        await newCategory.save()

        res.json({
            msg: 'Success! Created a new medicine',
            newCategory
        })

    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}

const getCategory = async (req, res) => {
    try{
        const category = await Category.find()

        res.json({category})
    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}