import Head from 'next/head'
import Link from 'next/link'
import {useContext} from 'react'
import {DataContext} from '../../redux/store'

const Orders = () => {
    const {state, dispatch} = useContext(DataContext)
    const {orders, auth} = state

    if(!auth.user) return null;
    return(
        <div>
        <Head>
            <title> Manage Orders </title>
        </Head>
        <div className='my-3 table-responsive'>
            <table className='table-bordered table-hover w-100 text-uppercase' style={{minWidth: '600px', cursor: 'pointer'}}>
                <thead className='bg-light font-weight-bold text-center'>
                    <tr>
                        <td className='p-2'>View</td>
                        <td className='p-2'>ID</td>
                        <td className='p-2'>Data</td>
                        <td className='p-2'>Total</td>
                        <td className='p-2'>Delivered</td>
                        <td className='p-2'>Paid</td>                                  
                        <td className='p-2'>Delete</td>
                    </tr>
                </thead>
                <tbody className='text-center'>
                    {
                        orders.map((order) => (
                            <tr key={order._id}>
                                <td className='p-2'>{<Link href={`/order/${order._id}`}><a><i className='fas fa-eye text-info font-size-auto'></i></a></Link>}</td>
                                <td className='p-2'>{order._id}</td>
                                <td className='p-2'>{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td className='p-2'>${order.total}</td>
                                <td className='p-2'>{order.delivered ? <i className='fas fa-check text-success'></i> : <i className='fas fa-times text-danger'></i>}</td>
                                <td className='p-2'>{order.paid ? <i className='fas fa-check text-success'></i> : <i className='fas fa-times text-danger'></i>}</td>
                                {order.paid === true 
                                ? (
                                    auth.user.role !== 'admin' && !auth.user.root
                                    ? <td className='p-2'>{<i className='fas fa-trash-alt text-danger font-size-auto' aria-hidden='true' style={{fontSize: '18px'}} onClick={() => dispatch({type: 'NOTIFY', payload: {error: 'You had paid for Order'}})}></i>}</td> 
                                    : <td className='p-2'>{<i className='fas fa-trash-alt text-danger font-size-auto' aria-hidden='true' style={{fontSize: '18px'}} data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => dispatch({type: 'ADD_MODAL', payload: [{data: orders, id: order._id, title: order.user.name, type: 'ADD_ORDER'}]})}></i>}</td>
                                )
                                : <td className='p-2'>{<i className='fas fa-trash-alt text-danger font-size-auto' aria-hidden='true' style={{fontSize: '18px'}} data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => dispatch({type: 'ADD_MODAL', payload: [{data: orders, id: order._id, title: order.user.name, type: 'ADD_ORDER'}]})}></i>}</td>
                                }
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
        </div>
    )
}

export default Orders