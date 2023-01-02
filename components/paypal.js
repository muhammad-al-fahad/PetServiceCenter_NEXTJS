import {useEffect, useRef, useContext} from 'react'
import { patchData } from '../utils/fetchData'
import { DataContext } from '../redux/store'
import { updateItem } from '../redux/action'

const Paypal = ({order}) => {
    
    const {state, dispatch} = useContext(DataContext)
    const refPaypal = useRef()
    const {auth, orders} = state

    useEffect(() => {
        paypal.Buttons({
            createOrder: (data, actions) => {
              return actions.order.create({
                purchase_units: [{
                  amount: {
                    value: order.total
                  }
                }]
              });
            },
            onApprove: (data, actions) => {

              return actions.order.capture().then(function(orderData) {

                dispatch({ type: 'NOTIFY', payload: {loading: true}})

                patchData(`order/payment/${order._id}`, {
                  paymentID: orderData.payer.payer_id
                }, auth.token).then(res => {

                  if(res.err) 
                    return dispatch({ type: 'NOTIFY', payload: {error: res.err}})

                  dispatch(updateItem(orders, order._id, {
                    ...order,
                    paid: true, dateOfPayment: orderData.create_time,
                    paymentID: orderData.payer.payer_id, method: 'Paypal'
                  }, 'ADD_ORDER'))

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