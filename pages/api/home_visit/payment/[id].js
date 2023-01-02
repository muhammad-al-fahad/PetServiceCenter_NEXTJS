import ConnectDB from "../../../../utils/mongodb";
import auth from '../../../../middleware/auth';
import Service from '../../../../model/home_visit/service';
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

ConnectDB()

export default async (req, res) => {
    switch(req.method){
         case 'PATCH':
            await createPayment(req, res)
            break;
    }
}

const createPayment = async (req, res) => {
    try{
        
        const result = await auth(req, res)
        if(result.role === 'user' || result.role === 'membership'){
            const {service} = req.body

            const line_items = [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: ' Home Visit'
                        },
                        unit_amount: service.visit_price[0].price * 100,
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
                success_url: `${process.env.BASE_URL}/appointment/${service.appointment}?success=true`,
                cancel_url: `${process.env.BASE_URL}/appointment/${service.appointment}?canceled=true`,
            });
            res.send({url: session.url})

            await Service.findOneAndUpdate({_id: service._id}, {
                paymentID: session.payment_intent
            })
        }
    }
   catch(err) {
        return res.status(500).json({err: err.message})
    }
}