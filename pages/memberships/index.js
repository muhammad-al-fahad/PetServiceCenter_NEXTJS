import Head from 'next/head'
import { useContext, useEffect, useState } from 'react'
import { DataContext } from '../../redux/store'
import Membership from '../../components/membership/item'

const Member = () => {

    const {state, dispatch} = useContext(DataContext)
    const {member, auth} = state

    const {user} = auth

    const [detail, setDetail] = useState('')

    useEffect(() => {
        setDetail(member)
    }, [member, auth.user])

    return(
        <div>
            <Head>
                <title> Membership </title>
            </Head>
                <div className='membership'>
                    {
                        detail.length === 0 ?
                        <h2> No Membership </h2>
                        : detail.map(item => (
                            auth.user && <Membership key={item._id} users={user} members={item} state={state} dispatch={dispatch}/>
                        ))
                    }
                </div>
            </div>
    )
}

export default Member