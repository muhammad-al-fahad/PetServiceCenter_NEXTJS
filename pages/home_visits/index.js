import Head from 'next/head'
import Link from 'next/link'
import {useContext} from 'react'
import {DataContext} from '../../redux/store'

const Home_Test = () => {
    const {state, dispatch} = useContext(DataContext)
    const {home_visit_result, appointments, auth} = state

    if(!auth.user) return null;
    return(
        <div>
        <Head>
            <title> Home Visit Results </title>
        </Head>
        <div className='my-3 table-responsive'>
            <table className='table-bordered table-hover w-100 text-uppercase' style={{minWidth: '600px', cursor: 'pointer'}}>
                <thead className='bg-light font-weight-bold text-center'>
                    <tr>
                        <td className='p-2'>ID</td>
                        <td className='p-2'>Appointment</td>
                        <td className='p-2'>User</td>
                        <td className='p-2'>Pet</td>
                        <td className='p-2'>Date</td>
                        <td className='p-2'>Time</td>
                        {auth.user.role === 'operator' && <td className='p-2'>Doctor</td>}
                        <td className='p-2'>Service</td>                                  
                        <td className='p-2'>Action</td>
                    </tr>
                </thead>
                <tbody className='text-center'>
                    {
                        home_visit_result.map((physical) => (
                            appointments.map((appoint) => (
                                physical.appointment === appoint._id && <tr key={physical._id}>
                                <td className='p-2'>{physical._id}</td>
                                <td className='p-2'>{appoint._id}</td>
                                <td className='p-2'>{appoint.user.email}</td>
                                <td className='p-2'>{appoint.petData[0].petName}</td>
                                <td className='p-2'>{new Date(appoint.date).toLocaleDateString()}</td>
                                <td className='p-2'>{appoint.timeData[0].name}</td>
                                {auth.user.role === 'operator' && <td className='p-2'>{appoint.doctorData[0].email}</td>}
                                <td className='p-2'>{appoint.serviceData[0].name}</td>
                                {auth.user.role === 'doctor' ? 
                                <div className='d-flex mx-2'>
                                    <td className='mt-2 mx-2'><Link href={`/home_visits/${physical._id}`}><i className='fas fa-eye text-info font-size-auto'></i></Link></td>
                                    {physical.appointment === appoint._id && <td className='mt-2 mx-2'><Link href={`/home_visit/result/${physical._id}?appoint=${appoint._id}`}><i className='fas fa-edit text-success'></i></Link></td>}
                                    <td className='mt-2 mx-2'><i className='fas fa-trash-alt text-danger font-size-auto' aria-hidden='true' data-bs-toggle="modal" data-bs-target="#exampleModal" style={{fontSize: '18px'}} onClick={() => dispatch({type: 'ADD_MODAL', payload: [{data: home_visit_result, id: physical._id, title: physical._id, type: 'ADD_HOME_VISIT_RESULT'}]})}></i></td>
                                </div> 
                                : <td className='mt-2 mx-2'><Link href={`/home_visits/${physical._id}`}><i className='fas fa-eye text-info font-size-auto'></i></Link></td>
                              }
                            </tr>
                            ))
                        ))
                    }
                </tbody>
            </table>
        </div>
        </div>
    )
}

export default Home_Test