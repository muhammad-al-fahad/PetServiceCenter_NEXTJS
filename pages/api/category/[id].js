import ConnectDB from "../../../utils/mongodb";
import Category from '../../../model/category';
import Products from '../../../model/product';
import auth from '../../../middleware/auth';

ConnectDB()

const CategoryId = async (req, res) => {
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
        if(result.role !== 'admin') return res.status(400).json({err: "Authentication is not valid"})

        const {id} = req.query
        const {name} = req.body

        const newCategory = await Category.findOneAndUpdate({_id: id}, {name})
        res.json({
            msg: "Success! Update a current category",
            category: {
                ...newCategory._doc,
                name
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
        if(result.role !== 'admin') return res.status(400).json({err: "Authentication is not valid"})

        const {id} = req.query

        const product = await Products.findOne({category: id})
        if(product) return res.status(400).json({err: "Please delete all products with a relationship"})

        await Category.findByIdAndDelete(id)
        res.json({msg: "Success! Deleted a current category"})

    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}

export default CategoryId