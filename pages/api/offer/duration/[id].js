import ConnectDB from "../../../../utils/mongodb";
import Offers from '../../../../model/offer';

ConnectDB()

export default async (req, res) => {
    switch(req.method){
         case 'PUT':
            await updateOffer(req, res)
            break;
    }
}

const updateOffer = async (req, res) => {
    try{

        const {id} = req.query
        const {duration} = req.body

        if(duration === 0)
            return res.status(400).json({err: "No Duration"})

        await Offers.findOneAndUpdate({_id: id}, {
            duration
        })

        res.json({msg: "Successfully Changed Duration!"})
    }
   catch(err) {
        return res.status(500).json({err: err.message})
    }
}