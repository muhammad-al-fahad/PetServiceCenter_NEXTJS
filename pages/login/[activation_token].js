import {postData} from '../../utils/fetchData'
import { useRouter } from 'next/router'
import { useEffect, useContext } from 'react'
import { DataContext } from '../../redux/store'

const Activate = () => {

    const router = useRouter()

    const {activation_token} = router.query

    const {state, dispatch} = useContext(DataContext)

    const activationUser = async () => {

        await postData('auth/activate', {activation_token}).then(res => {
        if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})

        dispatch({type: 'NOTIFY', payload: {success: res.msg}})

        return router.push('/login')
        })
    }

    useEffect(() => {
       if(activation_token){
            activationUser()
       }
    }, [activation_token, router])
}

export default Activate