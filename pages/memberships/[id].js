import Head from 'next/head'
import { useState, useContext, useEffect } from 'react'
import { DataContext } from '../../redux/store'
import { useRouter } from 'next/router'
import Member from '../../components/membership/detail'

const Memberships = () => {
    const {state, dispatch} = useContext(DataContext)
    const {member, auth} = state

    const router = useRouter()
    const [detail, setDetail] = useState([])

    useEffect(() => {
        const newArr = member.filter(member => member._id === router.query.id)
        setDetail(newArr)
    }, [member, auth.user])

    return(
        <div className='my-3'>
            <Head>
                {detail.map(it => (<title key={it._id}>{it.category.toLocaleUpperCase()} Membership</title>))}
            </Head>

            <div>
                <button className='btn btn-dark mx-2' onClick={() => router.back()}>
                    <i className='fas fa-long-arrow-alt-left' aria-hidden="true"></i> GO BACK
                </button>
            </div>
              {auth.user && <Member detail={detail} state={state} dispatch={dispatch}/>}         
        </div>
    )
}

export default Memberships