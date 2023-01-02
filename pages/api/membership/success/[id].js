import ConnectDB from "../../../../utils/mongodb";
import Users from '../../../../model/user';
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
        const {paid, token, membership, endDate} = req.body

        await Users.findOneAndUpdate({_id: token}, {
            paid: paid, dateOfPayment: new Date().toISOString(), method: 'Credit/ Debit card', role: 'membership', membership, endDate
        })

        res.send({url: `${process.env.BASE_URL}/memberships/${id}`})
    }
}
catch(err) {
        return res.status(500).json({err: err.message})
    }
}