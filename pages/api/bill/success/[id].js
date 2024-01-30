import ConnectDB from "../../../../utils/mongodb";
import Bill from '../../../../model/bill';
import auth from '../../../../middleware/auth';


ConnectDB()

const Success = async (req, res) => {

    switch(req.method){
        case 'PATCH':
            await payment(req, res)
            break;
    }
}

const payment = async (req, res) => {

    try{
        const result = await auth(req, res)
        if(result.role !== 'admin' || result.role !== 'operator' || result.role !== 'doctor'){

        const {id} = req.query
        const {paid} = req.body

        await Bill.findOneAndUpdate({_id: id}, {
            paid: paid, dateOfPayment: new Date().toISOString(), method: 'Credit/ Debit card'
        })

        res.send({url: `${process.env.BASE_URL}/bill`})
    }
}
catch(err) {
        return res.status(500).json({err: err.message})
    }
}

export default Success