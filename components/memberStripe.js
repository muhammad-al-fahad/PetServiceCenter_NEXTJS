import {useEffect, useContext, useState} from 'react'
import { patchData } from '../utils/fetchData'
import { DataContext } from '../redux/store'
import { loadStripe } from '@stripe/stripe-js'
import { useRouter } from 'next/router'

loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const Stripe = ({members, users}) => {
    const {state, dispatch} = useContext(DataContext)
    const router = useRouter()
    const { auth } = state
    const { success, canceled} = router.query;
   
    const StripeMember = () => {

        dispatch({ type: 'NOTIFY', payload: {loading: true}})
        patchData(`membership/payment/${members._id}`, {members, token: users.id}, auth.token).then(res => {

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

            let end;
            if(members.category === 'basic'){
                end = new Date().getTime() + 2526300000
            } else if(members.category === 'standard'){
                end = new Date().getTime() + 15616339307
            } else {
                end = new Date().getTime() + 31516300000
            }
    
            const currentYear = new Date(end).getFullYear()
            const currentMonth = new Date(end).getMonth()
            const currentDay = new Date(end).getDate()

            const endDate = new Date(currentYear, currentMonth, currentDay).toISOString()

            patchData(`membership/success/${members._id}`, {paid: true, token: users.id, membership: members.category, endDate}, auth.token).then(res => {

                if(res.err) 
                    return dispatch({ type: 'NOTIFY', payload: {error: res.err}}) 
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
            <button className='btn btn-dark' type="button" role="link" onClick={() => StripeMember()}>
                Pay with card
            </button>
        </>
    )
}

export default Stripe