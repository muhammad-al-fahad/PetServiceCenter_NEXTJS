import Head from 'next/head'
import { useState, useContext, useEffect } from 'react'
import { DataContext } from '../../redux/store'
import { useRouter } from 'next/router'
import Order from '../../components/detailOrder'

const DetailOrder = () => {
    const {state, dispatch} = useContext(DataContext)
    const {orders, auth} = state

    const router = useRouter()
    const [detail, setDetail] = useState([])

    useEffect(() => {
        const newArr = orders.filter(order => order._id === router.query.id)
        setDetail(newArr)
    }, [orders])

    if(!auth.user) return null;
    return(
        <div className='my-3'>
            <Head>
                <title> Order </title>
            </Head>

            <div>
                <button className='btn btn-dark mx-2' onClick={() => router.back()}>
                    <i className='fas fa-long-arrow-alt-left' aria-hidden="true"></i> GO BACK
                </button>
            </div>
              <Order detail={detail} state={state} dispatch={dispatch}/>         
        </div>
    )
}

export default DetailOrder