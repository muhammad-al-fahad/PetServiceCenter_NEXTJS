import ConnectDB from "../../../../utils/mongodb";
import Orders from '../../../../model/order';
import auth from '../../../../middleware/auth';
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
            const {order} = req.body

        const line_items = order.cart.map((item) => {
            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.title,
                        images: [item.images[0].url],
                        metadata: {
                            id: item._id,
                        },
                    },
                    unit_amount: result.role === 'membership' && result.membership === item.membership ? item.discount * 100 : item.price * 100,
                },
                quantity: item.quantity,
            };
        });
    
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
                success_url: `${process.env.BASE_URL}/order/${id}/?success=true`,
                cancel_url: `${process.env.BASE_URL}/order/${id}/?canceled=true`,
        });

            res.send({url: session.url})
    
            await Orders.findOneAndUpdate({_id: id}, {
                paymentID: session.payment_intent
             })
        }
        }
    catch(err) {
        return res.status(500).json({err: err.message})
    }
}