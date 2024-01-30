import Link from 'next/link'
import Paypal from './paypal'
import Stripe from './buttonPay'
import { patchData } from '../utils/fetchData'
import { updateItem } from '../redux/action'

const Detail = ({detail, state, dispatch}) => {

    const {auth, orders} = state

    const Delivered = (order) => {
        dispatch({type: 'NOTIFY', payload: {loading: true}})
        patchData(`order/delivered/${order._id}`, null, auth.token)
        .then(res => {
            if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})

            const {paid, dateOfPayment, method, delivered} = res.result

            dispatch(updateItem(orders, order._id, {
                ...order, paid, dateOfPayment, method, delivered
            }, 'ADD_ORDER'))

            return dispatch({type: 'NOTIFY', payload: {success: res.msg}})
        })
    }
    
    if(!auth.user) return null;
    return(
        <>           
        {
            detail.map(order => (
            <div key={order._id} className='d-flex justify-content-around' style={{margin: '20px auto'}}>
                <div className='text-uppercase my-3 mx-3' style={{maxWidth: '650px'}}>
                    <h2 className='text-break'>Order ID : {order._id}</h2>
                    <div className='mt-4 text-secondary'>
                        <h3 className='my-4'> Shipping Detail </h3>
                        <img className='my-4 mx-5' style={{borderRadius: '50%', objectFit: 'cover'}} src={order.user.avatar} alt={order.user.avatar} width='150px' height='150px'/>
                        <p>Name: {order.user.name}</p>
                        <p>Email: {order.user.email}</p>
                        <p>Address: {order.address}</p>
                        <p>Contact Number: {order.number}</p>
                        <p>CNIC: {order.user.cnic}</p>
                        <p>Birth: {new Date(order.user.dateofbirth).toDateString()}</p>
                        <p>Role: {order.user.role}</p>

                        <div className={`alert ${order.delivered ? 'alert-success' : 'alert-danger'} d-flex align-items-center justify-content-between my-4`} role='alert'>
                            {
                                order.delivered ? ` Delivered at ${new Date(order.updatedAt).toLocaleDateString()}` : 'Not Delivered'
                            }
                            {
                                auth.user.role === 'admin' && !order.delivered &&
                                <button className='btn btn-dark text-uppercase' onClick={() => Delivered(order)}> Mark as delivered </button>
                            }
                        </div>

                        <h3 className='my-4'> Payment </h3>
                        {
                            order.paid && order.method && <h6 className='my-2'>Method: <em>{order.method}</em></h6>
                        }
                          
                        {
                            order.paid && order.paymentID && <p className='my-2'>PaymentID: <em>{order.paymentID}</em></p>
                        }
                        <div className={`alert ${order.paid ? 'alert-success' : 'alert-danger'} d-flex align-items-center justify-content-between`} role='alert'>
                            {
                                order.paid ? ` Paid at ${new Date(order.dateOfPayment).toLocaleDateString()}` : 'Not Paid'
                            }
                        </div>
                    </div>
                    <div>
                        <h3 className='my-4 text-secondary'>Order Items</h3>
                        {
                            order.cart.map(item => (
                                <div className='d-flex border-bottom mx-0 p-2 justify-content-between align-items-center' key={item._id} style={{maxWidth: '550px'}}>
                                        <img src={item.images[0].url} alt={item.images[0].url} style={{width: '60px', height: '50px', objectFit: 'cover'}}/>

                                        <h5 className='flex-fill text-secondary px-3 m-0'>
                                        <Link href={`/product/${item._id}`}>
                                            <a>{item.title}</a>
                                        </Link>
                                        </h5>

                                        <span className='text-info m-0'>
                                        {item.quantity} X ${auth.user.role === 'membership' && auth.user.membership === item.membership ? item.discount : item.price} = ${auth.user.role === 'membership' && auth.user.membership === item.membership ? item.quantity * item.discount : item.quantity * item.price}
                                        </span>
                                </div>
                            ))
                        }
                    </div>
                </div>
                { !order.paid && auth.user.role !== 'admin' &&
                <div className='p-4'>
                   <h2 className='mb-4 text-uppercase'>Total: ${order.total}</h2>
                   {/* <Paypal order={order}/> */}
                   <Stripe order = {order}/>
                </div>
                }
            </div>
            ))
        }            
        </>
    )
}

export default Detail