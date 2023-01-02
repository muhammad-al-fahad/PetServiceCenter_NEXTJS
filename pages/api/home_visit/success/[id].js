import ConnectDB from "../../../../utils/mongodb";
import Service from '../../../../model/home_visit/service';
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
        if(result.role !== 'admin' || result.role !== 'operator' || result.role !== 'doctor'){

        const {id} = req.query
        const {paid, appoint} = req.body

        await Service.findOneAndUpdate({_id: id}, {
            paid: paid, dateOfPayment: new Date().toISOString(), method: 'Credit/ Debit card'
        })

        res.send({url: `${process.env.BASE_URL}/appointment/${appoint}`})
    }
}
catch(err) {
        return res.status(500).json({err: err.message})
    }
}