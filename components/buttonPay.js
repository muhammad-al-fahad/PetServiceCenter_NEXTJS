import {useEffect, useContext} from 'react'
import { patchData } from '../utils/fetchData'
import { DataContext } from '../redux/store'
import { loadStripe } from '@stripe/stripe-js'
import { useRouter } from 'next/router'
import { updateItem } from '../redux/action'

loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const ButtonPay = ({order}) => {
    const {state, dispatch} = useContext(DataContext)
    const router = useRouter()
    const {auth, orders} = state
    const { success, canceled} = router.query;
   
    const buttonPay = () => {
        dispatch({ type: 'NOTIFY', payload: {loading: true}})
        patchData(`order/pay/${order._id}`, {order}, auth.token).then(res => {

            if(res.err) 
            return dispatch({ type: 'NOTIFY', payload: {error: res.err}})

            if(res.url){
                window.location.href = res.url
            }
        })
    }

    useEffect(() => {

        if(success !== undefined || canceled !== undefined){
        if (success) {
            dispatch({ type: 'NOTIFY', payload: {loading: true}})
            patchData(`order/success/${order._id}`, {paid: true}, auth.token).then(res => {

                if(res.err) 
                    return dispatch({ type: 'NOTIFY', payload: {error: res.err}})


                dispatch(updateItem(orders, order._id, {
                    ...order,
                    paid: true, dateOfPayment: new Date().toISOString(), method: 'Credit/ Debit card'
                }, 'ADD_ORDER')) 
            })

            dispatch({ type: 'NOTIFY', payload: {success: "Order placed! You will receive an email confirmation."}})
        }

        if (canceled) {
            patchData(`order/cancel/${order._id}`, {paid: false}, auth.token).then(res => {

                if(res.err) 
                    return dispatch({ type: 'NOTIFY', payload: {error: res.err}})

                dispatch(updateItem(orders, order._id, {
                    ...order,
                    paid: false, dateOfPayment: new Date().toISOString(), method: 'Credit/ Debit card'
                }, 'ADD_ORDER')) 
            })
            
            dispatch({ type: 'NOTIFY', payload: {error: "Order canceled! Continue Shopping ..."}})
        }
       }
      }, [success, canceled]);

    return(
        <>
            <button className='btn btn-dark' type="button" role="link" onClick={() => buttonPay()}>
                Pay with card
            </button>
        </>
    )
}

export default ButtonPay