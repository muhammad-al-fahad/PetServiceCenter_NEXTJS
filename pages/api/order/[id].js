import ConnectDB from "../../../utils/mongodb";
import Orders from '../../../model/order';
import Products from '../../../model/product';
import auth from '../../../middleware/auth';

ConnectDB()

export default async (req, res) => {
    switch(req.method){
        case 'DELETE':
            await delOrder(req, res)
            break;
    }
}

const delOrder = async (req, res) => {
    try{
        const result = await auth(req, res)
        const {id} = req.query

        await Orders.findByIdAndDelete(id)

        res.json({msg: 'Deleted Success!'})
    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}