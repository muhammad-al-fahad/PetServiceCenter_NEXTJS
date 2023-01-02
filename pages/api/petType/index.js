import ConnectDB from "../../../utils/mongodb";
import petType from '../../../model/petType';
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
        if(result.role !== 'admin') return res.status(400).json({err: "Authentication is not valid"})
        
        const {name} = req.body
        if(!name) return res.status(400).json({err: "Name must have 1 character at least"})

        const newCategory = new petType({name})

        await newCategory.save()

        res.json({
            msg: 'Success! Created a new category',
            newCategory
        })

    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}

const getCategory = async (req, res) => {
    try{
        const petCategories = await petType.find()

        res.json({petCategories})
    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}