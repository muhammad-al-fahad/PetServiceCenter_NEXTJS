import ConnectDB from "../../../../utils/mongodb";
import Bill from '../../../../model/bill';
import auth from '../../../../middleware/auth';
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

ConnectDB()

const Payment = async (req, res) => {
    switch(req.method){
         case 'PATCH':
            await updateMember(req, res)
            break;
    }
}

const updateMember = async (req, res) => {
    try{

        const result = await auth(req, res)
        if(result.role !== 'admin' || result.role !== 'operator' || result.role !== 'doctor'){
            const {bill} = req.body

            const line_items = [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: bill.service,
                            metadata: {
                                id: bill._id,
                            },
                        },
                        unit_amount: bill.amount * 100,
                    },
                    quantity: 1,
                }
            ]
    
            const session = await stripe.checkout.sessions.create({
                payment_intent_data: {
                    setup_future_usage: 'on_session'
                },
                shipping_address_collection: {
                allowed_countries: ['PK'],
                },
                shipping_options: [
                {
                    shipping_rate_data: {
                    type: 'fixed_amount',
                    fixed_amount: {
                        amount: 0,
                        currency: 'usd',
                    },
                    display_name: 'Free shipping',
                    // Delivers between 5-7 business days
                    delivery_estimate: {
                        minimum: {
                        unit: 'business_day',
                        value: 5,
                        },
                        maximum: {
                        unit: 'business_day',
                        value: 7,
                        },
                    }
                    }
                },
                {
                    shipping_rate_data: {
                    type: 'fixed_amount',
                    fixed_amount: {
                        amount: 1500,
                        currency: 'usd',
                    },
                    display_name: 'Next day air',
                    // Delivers in exactly 1 business day
                    delivery_estimate: {
                        minimum: {
                        unit: 'business_day',
                        value: 1,
                        },
                        maximum: {
                        unit: 'business_day',
                        value: 1,
                        },
                    }
                    }
                },
                ],
                phone_number_collection: {
                enabled: true,
                },
                line_items,
                mode: 'payment',
                success_url: `${process.env.BASE_URL}/bill/?success=true`,
                cancel_url: `${process.env.BASE_URL}/bill/?canceled=true`,
            });
            res.send({url: session.url})
    
            await Bill.findOneAndUpdate({_id: bill._id}, {
                paymentID: session.payment_intent
            })
        }
    }
   catch(err) {
        return res.status(500).json({err: err.message})
    }
}

export default Payment