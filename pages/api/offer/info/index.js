import ConnectDB from "../../../../utils/mongodb";
import Offers from '../../../../model/offer';

ConnectDB()

const Offer = async (req, res) => {
    switch(req.method){
        case 'GET':
            await getOffer(req, res)
            break;
    }
}

const getOffer = async (req, res) => {
    try{

        const offer = await Offers.find()

        res.json({offer})
    }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}

export default Offer