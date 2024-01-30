import { useContext } from 'react'
import { DataContext } from '../redux/store'
import Loading from './loading'
import Notification from './notification'

const Notify = () => {

   const {state, dispatch} = useContext(DataContext)
   const {notify} = state

   return(
    <>
       {notify.loading && <Loading/>}
       {notify.error && <Notification msg={{msg: notify.error, title: "Error"}} handleShadow={() => dispatch({type: 'NOTIFY', payload: {}})} bgColor="bg-danger"/>}
       {notify.success && <Notification msg={{msg: notify.success, title: "Success"}} handleShadow={() => dispatch({type: 'NOTIFY', payload: {}})} bgColor="bg-success"/>}
    </>
   )
}

export default Notify