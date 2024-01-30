import {useEffect, useRef, useContext} from 'react'
import { patchData } from '../utils/fetchData'
import { DataContext } from '../redux/store'
import { updateItem } from '../redux/action'

const Paypal = ({members}) => {
    
    const {state, dispatch} = useContext(DataContext)
    const refPaypal = useRef()
    const {auth, member} = state

    useEffect(() => {
        paypal.Buttons({
            createOrder: (data, actions) => {
              return actions.order.create({
                purchase_units: [{
                  amount: {
                    value: members.price
                  }
                }]
              });
            },
            onApprove: (data, actions) => {

              return actions.order.capture().then(function(memberData) {

                dispatch({ type: 'NOTIFY', payload: {loading: true}})

                patchData(`membership/payment/${members._id}`, {
                  paymentID: memberData.payer.payer_id
                }, auth.token).then(res => {

                  if(res.err) 
                    return dispatch({ type: 'NOTIFY', payload: {error: res.err}})

                  dispatch(updateItem(member, members._id, {
                    ...members,
                    paid: true, dateOfPayment: memberData.create_time,
                    paymentID: memberData.payer.payer_id, method: 'Paypal'
                  }, 'ADD_MEMBER'))

                  return dispatch({ type: 'NOTIFY', payload: {success: res.msg}})

                })      
              });
            }
          }).render(refPaypal.current);
    }, [])

    return(
        <div ref={refPaypal}></div>
    )
}

export default Paypal