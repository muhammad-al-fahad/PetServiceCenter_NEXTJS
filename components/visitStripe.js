import {useEffect, useContext, useState} from 'react'
import { patchData } from '../utils/fetchData'
import { DataContext } from '../redux/store'
import { loadStripe } from '@stripe/stripe-js'
import { useRouter } from 'next/router'

loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const Stripe = ({service}) => {
    const {state, dispatch} = useContext(DataContext)
    const router = useRouter()
    const { auth, home_visit_service } = state
    const { success, canceled} = router.query;
   
    const StripeVisit = () => {

        dispatch({ type: 'NOTIFY', payload: {loading: true}})
        patchData(`home_visit/payment/${service._id}`, {service}, auth.token).then(res => {

            console.log(service)

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

            patchData(`home_visit/success/${service._id}`, {paid: true, appoint: service.appointment}, auth.token).then(res => {

                if(res.err) 
                    return dispatch({ type: 'NOTIFY', payload: {error: res.err}})

                dispatch(updateItem(home_visit_service, service._id, {
                    ...service,
                    paid: true, dateOfPayment: new Date().toISOString(), method: 'Credit/ Debit card'
                }, 'ADD_HOME_VISIT_SERVICE')) 
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
            <button className='btn btn-dark w-50' type="button" role="link" onClick={() => StripeVisit()}>
                Pay
            </button>
        </>
    )
}

export default Stripe