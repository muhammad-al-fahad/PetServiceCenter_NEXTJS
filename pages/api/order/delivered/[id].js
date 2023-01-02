import ConnectDB from "../../../../utils/mongodb";
import Orders from '../../../../model/order';
import auth from '../../../../middleware/auth';

ConnectDB()

export default async (req, res) => {
    switch(req.method){
        case 'PATCH':
            await delivered(req, res)
            break;
    }
}

const delivered = async (req, res) => {

    try{
        const result = await auth(req, res)
        if(result.role !== 'admin')
            return res.status(400).json({err: 'Authentication is not valid'})
        const {id} = req.query

        const order = await Orders.findOne({_id: id})
        if(order.paid){
            await Orders.findOneAndUpdate({_id: id}, {delivered: true})

            res.json({msg: 'Ordered Delivered SuccessFull!', result: {
                paid: true, 
                dateOfPayment: order.dateOfPayment, 
                method: order.method, 
                delivered: true
            }})
        }else{
            await Orders.findOneAndUpdate({_id: id}, {paid: true, dateOfPayment: new Date().toISOString(), method: 'Recieved Cash', delivered: true})
            res.json({msg: 'Ordered Delivered SuccessFull!', result: {
                paid: true, 
                dateOfPayment: new Date().toISOString(), 
                method: 'Recieve Cash', 
                delivered: true
            }})
        }

         

    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}