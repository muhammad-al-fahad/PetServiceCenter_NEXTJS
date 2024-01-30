import ConnectDB from "../../../utils/mongodb";
import Products from '../../../model/product';
import auth from '../../../middleware/auth';

ConnectDB()

const Change = async (req, res) => {
    switch(req.method){
        case 'POST':
            await updateOrder(req, res)
            break;
    }
}

const updateOrder = async (req, res) => {
    try{
        const result = await auth(req, res)
        const {cart, delivered} = req.body

        if(result.role === 'admin'){
            if(delivered === false){
                cart.map(item => {
                    return Sold(item._id, item.quantity)
                })
            }
            else{
                cart.map(item => {
                    return;
                })
            }
        }
        else {
            cart.map(item => {
                return Sold(item._id, item.quantity)
            })
        }

    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}



const Sold = async (id, quantity) => {

    const current = await Products.findById(id);

    await Products.findOneAndUpdate({_id: id}, {
        sold: current.sold - quantity,
        inStock: current.inStock + quantity
    })
}

export default Change