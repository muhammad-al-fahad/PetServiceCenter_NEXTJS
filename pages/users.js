import Head from 'next/head'
import { useContext } from 'react'
import { DataContext } from '../redux/store'
import Link from 'next/link'

const Users = () => {

    const {state, dispatch} = useContext(DataContext)
    const {users, auth} = state

    if(!auth.user) return null;
    return(
        <div  className='table-responsive'>
            <Head>
                <title> Users </title>
            </Head>

            <table className='table w-100'>
               <thead className='text-center'>
                    <tr>
                        <th>#</th>
                        <th>ID</th>
                        <th>Avatar</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Admin</th>
                        <th>Doctor</th>
                        <th>Operator</th>
                        <th>Membership</th>
                        <th>Action</th>
                    </tr>
               </thead>

               <tbody className='text-center'>
                    {
                        users.map((user, index) => (
                            <tr key={user._id} style={{cursor: 'pointer'}}>
                                <td>{index + 1}</td>
                                <td>{user._id}</td>
                                <td>
                                    <img src= {user.avatar} alt= {user.avatar} 
                                    style={{width: '30px', height: '30px',
                                    borderWidth: 1, borderRadius: '50%',
                                    overflow: 'hidden', objectFit: 'cover'}}/>
                                </td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    {
                                        user.role === 'admin' 
                                        ? (user.root 
                                            ? <i className='fas fa-check text-success'> Root </i> 
                                            : <i className='fas fa-check text-success'></i>)
                                        : <i className='fas fa-times text-danger'></i>
                                    }
                                </td>
                                <td>
                                    {
                                        user.role === 'doctor' 
                                        ? <i className='fas fa-check text-success'></i>
                                        : <i className='fas fa-times text-danger'></i>
                                    }
                                </td>
                                <td>
                                    {
                                        user.role === 'operator' 
                                        ? <i className='fas fa-check text-success'></i>
                                        : <i className='fas fa-times text-danger'></i>
                                    }
                                </td>
                                <td>
                                    {
                                        user.role === 'membership' 
                                        ? <i className='fas fa-check text-success'></i>
                                        : <i className='fas fa-times text-danger'></i>
                                    }
                                </td>
                                <td>
                                    <Link href={
                                        auth.user.root && auth.user.email !== user.email
                                        ? `/edit_User/${user._id}` : '#!'
                                    }>
                                        <a><i className='fas fa-edit text-info mx-2' title='Edit'></i></a>
                                    </Link>
                                    {
                                        auth.user.root && auth.user.email !== user.email
                                        ? <i className='fas fa-trash-alt text-danger mx-2' title='Remove' data-bs-toggle='modal' data-bs-target='#exampleModal' onClick={() => dispatch({type: 'ADD_MODAL', payload: [{data: users, id: user._id, title: user.name, type: 'ADD_USER'}]})}></i>
                                        : <i className='fas fa-trash-alt text-danger mx-2' title='Remove' aria-disabled='true'></i>
                                    }
                                </td>
                            </tr>
                        ))
                    }
               </tbody>
            </table>
        </div>
    )
}

export default Users