import Head from 'next/head'
import Link from 'next/link'
import {useContext} from 'react'
import {DataContext} from '../../redux/store'
import Stripe from '../../components/billStripe'

const Bill = () => {
    const {state, dispatch} = useContext(DataContext)
    const {bills, appointments, auth} = state

    if(!auth.user) return null;
    return(
        <div>
        <Head>
            <title> Appointment Bills </title>
        </Head>
        <div className='my-3 table-responsive'>
            <table className='table-bordered table-hover w-100 text-uppercase' style={{minWidth: '600px', cursor: 'pointer'}}>
                <thead className='bg-light font-weight-bold text-center'>
                    <tr>
                        <td className='p-2'>ID</td>
                        <td className='p-2'>Appointment</td>
                        <td className='p-2'>User</td>
                        <td className='p-2'>Pet</td>
                        {auth.user.role !== 'doctor' && <td className='p-2'>Doctor</td>}
                        <td className='p-2'>Date</td>
                        <td className='p-2'>Time</td> 
                        <td className='p-2'>Service</td>
                        {(auth.user.role === 'user' || auth.user.role === 'membership') && <td className='p-2'>paid</td>}                                 
                        <td className='p-2'> Action </td>
                    </tr>
                </thead>
                <tbody className='text-center'>
                    {
                        bills.map((physical) => (
                            appointments.map(app => (
                            app._id === physical.appointment && <tr key={physical._id}>
                            <td className='p-2'>{physical._id}</td>
                            <td className='p-2'>{physical.appointment}</td>
                            {(auth.user.role !== 'user' || auth.user.role !== 'membership')  && <td className='p-2'>{app.user.name}</td>}
                            <td className='p-2'>{app.petData[0].petName}</td>
                            {auth.user.role !== 'doctor' && <td className='p-2'>{app.doctorData[0].name}</td>}
                            <td className='p-2'>{new Date(app.date).toLocaleDateString()}</td>
                            <td className='p-2'>{app.timeData[0].name}</td>
                            <td className='p-2'>{physical.service}</td>
                            {(auth.user.role === 'user' || auth.user.role === 'membership') && <td className='p-2'>{physical.paid ? <i className='fas fa-check-circle text-success'></i> : <i className='fas fa-times-circle text-danger'></i>}</td>}
                            {auth.user.role === 'operator' ? 
                            <div className='d-flex mx-2'>
                                <td className='mt-2 mx-2'><Link href={`/bill/${physical._id}`}><i className='fas fa-eye text-info font-size-auto'></i></Link></td>
                                <td className='mt-2 mx-2'><Link href={`/bills/${physical._id}`}><i className='fas fa-edit text-success'></i></Link></td>
                            </div> 
                            : !physical.paid ? <td className='mt-2 mx-2'><Stripe bill = {physical}/></td> : <td className='mt-2 mx-2'><Link href={`/bill/${physical._id}`}><i className='fas fa-eye text-info font-size-auto'></i></Link></td>
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

export default Bill