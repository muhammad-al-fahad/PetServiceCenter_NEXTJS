import ConnectDB from "../../../utils/mongodb";
import Offers from '../../../model/offer';
import auth from '../../../middleware/auth'
import Products from '../../../model/product';

ConnectDB()

const Offer = async (req, res) => {
    switch(req.method){
         case 'GET':
            await getOfferID(req, res)
            break;
         case 'PUT':
            await updateOffer(req, res)
            break;
         case 'DELETE':
            await delOffer(req, res)
            break; 
    }
}

const getOfferID = async (req, res) => {
    try{
        const {id} = req.query

        const offer = await Offers.findById(id)
        if(!offer)
                return res.status(400).json({err: "This Offer is not existed"})

        res.json({offer})
    }
   catch(err) {
        return res.status(500).json({err: err.message})
    }
}

const updateOffer = async (req, res) => {
    try{
        const result = await auth(req, res)
        if(result.role !== 'admin') return res.status(400).json({err: "Authentication is not valid"})

        const {id} = req.query
        const {title, poster, discount, product, category, startDate, endDate, duration} = req.body

        if(category === 'all' || discount === 0 || discount > 100 || product.length === 0 || poster.length === 0 || !startDate || !endDate || duration === 0)
            return res.status(400).json({err: "Please fill all the fields"})

        product.map(async (pro) => {

            const finali = await Products.findOne({_id: pro._id})

            const {price} = finali

            await Products.findOneAndUpdate({_id: pro._id}, {
                discount, membership: category
            })

        })

        await Offers.findOneAndUpdate({_id: id}, {
            title: title.toLowerCase(), poster, category, startDate, endDate, duration, discount, products: product
        })

        res.json({msg: `Success! Updated a ${title} Offer`})
        return await info(category)
    }
   catch(err) {
        return res.status(500).json({err: err.message})
    }
}

const info = async (category) => {
    const offer = await Offers.find()

    offer.map(async (o) => {
        o.products.map(async (p) => {
            await Products.findOneAndUpdate({_id: p._id}, {
                offer: o._id, membership: category
            })
        })
    })
}

const delOffer = async (req, res) => {
    try{
       const result = await auth(req, res)
       if(result.role !== 'admin') return res.status(400).json({err: "Authentication is not valid"})

       const {id} = req.query
       
       const offer = await Offers.findByIdAndDelete(id)

       await Products.findOneAndUpdate({offer: id}, {
        membership: ''
       })

       res.json({msg: `Success! Deleted the ${offer.title} Offer`})
    }
   catch(err) {
        return res.status(500).json({err: err.message})
    }
}

export default Offer