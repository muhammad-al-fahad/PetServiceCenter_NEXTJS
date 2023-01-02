import {useEffect, useContext} from 'react'
import { patchData } from '../utils/fetchData'
import {updateItem} from '../redux/action'
import { DataContext } from '../redux/store'
import { loadStripe } from '@stripe/stripe-js'
import { useRouter } from 'next/router'

loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const Stripe = ({bill}) => {
    const {state, dispatch} = useContext(DataContext)
    const router = useRouter()
    const { auth, bills } = state
    const { success, canceled} = router.query;
   
    const StripeBill = () => {

        dispatch({ type: 'NOTIFY', payload: {loading: true}})
        patchData(`bill/payment`, {bill}, auth.token).then(res => {

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

            patchData(`bill/success/${bill._id}`, {paid: true}, auth.token).then(res => {

                if(res.err) 
                    return dispatch({ type: 'NOTIFY', payload: {error: res.err}})

                dispatch(updateItem(bills, bill._id, {
                    ...bill,
                    paid: true, dateOfPayment: new Date().toISOString(), method: 'Credit/ Debit card'
                }, 'ADD_BILL')) 
            })

            dispatch({ type: 'NOTIFY', payload: {success: "Payment Success"}})
        }

        if (canceled) {           
            dispatch({ type: 'NOTIFY', payload: {error: "Payment Canceled!"}})
        }
       }
      }, [success, canceled]);

    return(
        <>
            <button className='btn btn-dark' type="button" role="link" onClick={() => StripeBill()}>
                Pay
            </button>
        </>
    )
}

export default Stripe