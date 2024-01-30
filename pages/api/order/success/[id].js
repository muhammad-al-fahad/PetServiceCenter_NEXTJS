import ConnectDB from "../../../../utils/mongodb";
import Orders from '../../../../model/order';
import auth from '../../../../middleware/auth';


ConnectDB()

export default async (req, res) => {

    switch(req.method){
        case 'PATCH':
            await payment(req, res)
            break;
    }
}

const payment = async (req, res) => {

    try{
        const result = await auth(req, res)
        if(result.role !== 'admin'){
        const {id} = req.query
        const {paid} = req.body

        await Orders.findOneAndUpdate({_id: id}, {
            paid: paid, dateOfPayment: new Date().toISOString(), method: 'Credit/ Debit card'
        })
        res.send({url: `${process.env.BASE_URL}/order/${id}`})
    }
}
catch(err) {
        return res.status(500).json({err: err.message})
    }
}