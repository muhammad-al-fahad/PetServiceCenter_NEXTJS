import ConnectDB from "../../../utils/mongodb";
import Products from '../../../model/product';
import Orders from '../../../model/order';
import auth from '../../../middleware/auth';

ConnectDB()

export default async (req, res) => {
    switch(req.method){
        case 'POST':
            await createOrders(req, res)
            break;
        case 'GET':
            await viewOrders(req, res)
            break;
    }
}

const viewOrders = async (req, res) => {
    try{
        const result = await auth(req, res)

        let orders;
        if(result.role !== 'admin'){
            orders = await Orders.find({user: result.id}).populate("user", "-password -root")
        }else{
            orders = await Orders.find().populate("user", "-password")
        }

        res.json({orders})
    }
    catch(err){
        return res.status(500).json({err: err.message})
    }
}

const createOrders = async (req, res) => {
       try{
            const result = await auth(req, res)
            const { address, number, cart, total } = req.body
            const newOrder = new Orders({
                user: result.id, address, number, cart, total
            })
            cart.filter(item => {
                return Sold(item._id, item.quantity, item.inStock, item.sold)
            })
            await newOrder.save();
            res.json({
                msg: 'Order Success! We will contact your to confirm the order',
                newOrder
            })
       }
       catch(err) {
            return res.status(500).json({err: err.message})
       }
}

const Sold = async (id, quantity, oldInStock, oldSold) => {
     await Products.findOneAndUpdate({_id: id}, {
        sold: quantity + oldSold,
        inStock: oldInStock - quantity 
     })
}
