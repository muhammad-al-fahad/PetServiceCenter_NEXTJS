import Head from 'next/head'
import Link from 'next/link'
import {useContext, useEffect, useState} from 'react'
import {DataContext} from '../../redux/store'
import Filter from '../../components/appointmentFilter'
import { useRouter } from 'next/router'
import {getData, patchData} from '../../utils/fetchData'
import filterProduct from '../../utils/filterProduct'

const Appointment = (props) => {
    const initial = {
        timing: "",
        date: "",
        pet: "",
        service: "",
        doctor: ""
     }

    const {state, dispatch} = useContext(DataContext)
    const {pets, doctors, services, timings, bills, modal, auth} = state

    const router = useRouter()

    const [appoint, setAppoint] = useState(initial)
    const [appointments, setAppointments] = useState(props.appointment)
    const {timing, date, pet, service, doctor} = appoint

    const [page, setPage] = useState(1)

    const [appointment, setAppointment] = useState([])
    const [doctorData, setDoctorData] = useState([])
    const [petData, setPetData] = useState([])
    const [petName, setPetName] = useState('')
    const [serviceData, setServiceData] = useState([])
    const [timeData, setTimeData] = useState([])

     const Handle = (props) => {
        const {name, value} = props.target
        setAppoint({...appoint, [name]: value})
        dispatch({type: 'NOTIFY', payload: {}})
     }

     useEffect(() => {
        setAppointments(props.appointment)
     }, [props.appointment])
    
    useEffect(() => {
        if(Object.keys(router.query).length === 0){
          setPage(1)
        }
    }, [router.query])

     useEffect(() => {

        let newDoctor = [];
        let newPet = [];
        let newService = [];
        let newTime = [];

        pet && pets.map(p => {
            if(p._id === pet) newPet.push(p)
        })

        doctor && doctors.map(d => {
            if(d._id === doctor) newDoctor.push(d)
        })

        service && services.map(s => {
            if(s._id === service) newService.push(s)
        })

        timing && timings.map(t => {
            if(t._id === timing) newTime.push(t)
        })

        setDoctorData(newDoctor)
        setPetData(newPet)
        setServiceData(newService)
        setTimeData(newTime)

        if(newPet.length !== 0) setPetName(newPet[0].petName)

     }, [appoint, modal])

     useEffect(() => {

        let times = [...timings]

        appointments.map(appoint => {
            if(doctor && date && appoint.doctor === doctor && appoint.date === new Date(date).toISOString()){
                for( var i=times.length - 1; i>=0; i--){
                    if(times[i] && (times[i]._id === appoint.time)){
                        times.splice(i, 1);
                    }
                }
            }
        })

        modal.length !== 0 && timings.map(time => {
            appointments.map(appoint => {
                if(appoint._id === modal[0].id){
                    if(appoint.time === time._id) times.push(time)
                }
            })
        })

        setAppointment(times)

     }, [appointments, modal, date, doctor])

    useEffect(() => {
        if(modal.length !== 0){
            appointments.map(appoint => {
                if(appoint._id === modal[0].id){
                    setAppoint({timing: appoint.time, date: appoint.date, doctor: appoint.doctor, service: appoint.service, pet: appoint.pet})
                }
            })
        }
    }, [modal])

    const loadMore = () => {
        setPage(page + 1)
        filterProduct({router, page: page + 1})
    }

    const Submit = async (props) => {
        props.preventDefault()

        if(auth.user.role !== 'user' && auth.user.role !== 'membership') 
            return dispatch({type: 'NOTIFY', payload: {error: "Only user/ membership are allowed to book appointment"}})

        if(timing === 'all' || !date || pet === 'all' || service === 'all' || doctor === 'all' || !petName)
            return dispatch({type: 'NOTIFY', payload: {error: "Please fill all the fields"}})

        dispatch({type: 'NOTIFY', payload: {loading: true}})

        const res = await patchData(`appointment/${modal[0].id}`, {time: timing, timeData: timeData[0], service, serviceData: serviceData[0], doctor, doctorData: doctorData[0], petName, date, pet, petData: petData[0]}, auth.token)

        if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})
        dispatch({type: 'ADD_MODAL', payload: []})
        dispatch({ type: 'NOTIFY', payload: {success: res.msg}})

        setAppoint(initial)
        setAppointment([])
        setDoctorData([])
        setPetData([])
        setServiceData([])
        setTimeData([])
    }

    if(!auth.user) return null;
    return(
        <div>
        <Head>
            <title> Manage Appointments </title>
        </Head>

        <Filter state={state}/>

        <div className='my-3 table-responsive'>
            <table className='table-bordered table-hover w-100 text-uppercase' style={{minWidth: '600px', cursor: 'pointer'}}>
                <thead className='bg-light font-weight-bold text-center'>
                    <tr>
                        <td className='p-2'>ID</td>
                        <td className='p-2'>Date</td>
                        <td className='p-2'>Service</td>
                        <td className='p-2'>Avatar</td>
                        <td className='p-2'>Name</td>
                        <td className='p-2'>Email</td>
                        <td className='p-2'>Time</td>                                  
                        <td className='p-2'>PetImage</td>                                  
                        <td className='p-2'>Pet</td>                                  
                        <td className='p-2'> Accept </td>                                  
                        <td className='p-2'>Action</td>
                    </tr>
                </thead>
                <tbody className='text-center'>
                    {
                        appointments.map((appoint) => (
                            <tr key={appoint._id}>
                                <td className='p-2'>{appoint._id}</td>
                                <td className='p-2'>{new Date(appoint.date).toLocaleDateString()}</td>
                                {appoint.serviceData[0] && <td className='p-2 text-capitalize'>{appoint.serviceData[0].name}</td>}
                                <td className='p-2'>
                                    <img src= {auth.user.role === 'doctor' || auth.user.role === 'operator' ? appoint.user && appoint.user.avatar : appoint.doctorData[0] && appoint.doctorData[0].avatar} alt= {auth.user.role === 'doctor' ? appoint.user[0] && appoint.user[0].avatar : appoint.doctorData[0] && appoint.doctorData[0].avatar} 
                                        style={{width: '30px', height: '30px',
                                        borderWidth: 1, borderRadius: '50%',
                                        overflow: 'hidden', objectFit: 'cover'}}/>
                                </td>
                                <td className='p-2 text-capitalize'>{auth.user.role === 'doctor' || auth.user.role === 'operator' ? `${appoint.user && appoint.user.name}` : `${appoint.doctorData[0] && appoint.doctorData[0].name}`}</td>
                                {auth.user.role === 'doctor' || auth.user.role === 'operator' ? <td className='p-2 text-lowercase'>{appoint.user && appoint.user.email}</td> : <td className='p-2 text-lowercase'>{appoint.doctorData[0] && appoint.doctorData[0].email}</td>}
                                <td className='p-2'>{appoint.timeData[0] && appoint.timeData[0].name}</td>
                                <td className='p-2'>
                                    <img src= {appoint.petData[0] && appoint.petData[0].images[0].url} alt= {appoint.petData[0] && appoint.petData[0].images[0].url} 
                                            style={{width: '30px', height: '30px',
                                            borderWidth: 1, borderRadius: '50%',
                                            overflow: 'hidden', objectFit: 'cover'}}/>
                                </td>
                                <td className='p-2 text-capitalize'>{appoint.petData[0] && appoint.petData[0].petName}</td>
                                <td className='p-2 text-capitalize'>{appoint.accept ? <i className='far fa-check-circle text-success'></i> : <i className='far fa-times-circle text-danger'></i>}</td>
                                {appoint.accept === true 
                                ? (
                                    auth.user.role === 'user' || auth.user.role === 'membership'
                                    ? <div className='d-flex mx-2'>
                                        <td className='mt-2 mx-2'><Link href={`/appointment/${appoint._id}`}><i className='fas fa-eye text-info font-size-auto'></i></Link></td>
                                        <td className='mt-2 mx-2'><i className='fas fa-edit text-success' aria-hidden='true' onClick={() => dispatch({type: 'NOTIFY', payload: {error: 'Your appointment is accepted'}})}></i></td>
                                        <td className='mt-2 mx-2'><i className='fas fa-trash-alt text-danger font-size-auto' aria-hidden='true' style={{fontSize: '18px'}} onClick={() => dispatch({type: 'NOTIFY', payload: {error: 'Your appointment is accepted'}})}></i></td>
                                      </div> 
                                    : auth.user.role === 'operator' ? <div className='d-flex mx-2'>
                                        {
                                            appoint.bill ?
                                            <td className='mt-2 mx-5'><i className='far fa-check-circle text-success'></i></td> : <td className='mt-2 mx-2'><button className='btn btn-dark'><Link href={`/bills?appoint=${appoint._id}`}> Generate </Link></button></td>
                                        }
                                    </div>
                                    : <div className='d-flex mx-2'>
                                        <td className='mt-2 mx-2'><Link href={`/appointment/${appoint._id}`}><i className='fas fa-eye text-info font-size-auto'></i></Link></td>
                                        <td className='mt-2 mx-2'><i className='fas fa-trash-alt text-danger font-size-auto' aria-hidden='true' style={{fontSize: '18px'}} data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => dispatch({type: 'ADD_MODAL', payload: [{data: appointments, id: appoint._id, title: appoint.user.email, type: 'ADD_APPOINTMENTS'}]})}></i></td>
                                      </div>
                                )
                                : auth.user.role !== 'operator' && <div className='d-flex mx-2'>
                                    <td className='mt-2 mx-2'><Link href={`/appointment/${appoint._id}`}><i className='fas fa-eye text-info font-size-auto'></i></Link></td>
                                    <td className='mt-2 mx-2'>{auth.user.role !== 'doctor' && <i className='fas fa-edit text-success' aria-hidden='true' data-bs-toggle="modal" data-bs-target="#updateModal" onClick={() => dispatch({type: 'ADD_MODAL', payload: [{data: appointments, id: appoint._id, title: appoint.doctorData[0].name, type: 'ADD_APPOINTMENTS'}]})}></i>}</td>
                                    <td className='mt-2 mx-2'><i className='fas fa-trash-alt text-danger font-size-auto' aria-hidden='true' style={{fontSize: '18px'}} data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => dispatch({type: 'ADD_MODAL', payload: [{data: appointments, id: appoint._id, title: appoint.doctorData[0].name, type: 'ADD_APPOINTMENTS'}]})}></i></td>
                                  </div>
                                }
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            <div className="modal fade" id="updateModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title text-capitalize" id="exampleModalLabel"> {modal.length !== 0 && modal[0].title} </h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => dispatch({type: 'ADD_MODAL', payload: []})}></button>
                    </div>

                    <div className="modal-body">
                    <div className='form-group input-group-prepend mx-4 my-4'>
                        <label htmlFor='pet' style={{fontWeight: 'bold'}}> Pet </label>
                        <select id= 'pet' name='pet' value={pet} onChange={Handle} className="form-control text-capitalize mt-4 w-100">
                            <option value='all'> All Pets </option>
                            {
                                pets.map(animal => (
                                    <option key={animal._id} value={animal._id}> {animal.petName} </option>
                                ))
                            }
                        </select>
                    </div>

                    <div className='form-group input-group-prepend my-4 mx-4'>
                        <label htmlFor='doctor' style={{fontWeight: 'bold'}}> Doctor </label>
                        <select id= 'doctor' name='doctor' value={doctor} onChange={Handle} className="form-control text-capitalize mt-4 w-100">
                            <option value='all'> All Doctors </option>
                            {
                                doctors.map(doc => (
                                    <option key={doc._id} value={doc._id}> {doc.name} </option>                   
                                ))
                            }
                        </select>
                    </div>

                    <div className='form-group input-group-prepend mx-4 my-4'>
                        <label htmlFor='service' style={{fontWeight: 'bold'}}> Service </label>
                        <select id= 'service' name='service' value={service} onChange={Handle} className="form-control text-capitalize mt-4 w-100">
                            <option value='all'> All Services </option>
                            {
                                services.map(doc => (
                                    <option key={doc._id} value={doc._id}> {doc.name} </option>                   
                                ))
                            }
                        </select>
                    </div>

                    <div className='form-group input-group-prepend mx-4 my-4'>
                        <label htmlFor='date' style={{fontWeight: 'bold'}}> Date </label>
                        <input type="date" id="date" className="form-control my-4" name='date' value={date} onChange={Handle}/>
                    </div>

                    <div className='form-group input-group-prepend mx-4 my-4'>
                        <label htmlFor='timing' style={{fontWeight: 'bold'}}> Time </label>
                        <select id= 'timing' name='timing' value={timing} onChange={Handle} className="form-control text-capitalize mt-4 w-100">
                            <option value='all'> All Timing </option>
                            {
                                appointment.map(doc => (
                                    <option key={doc._id} value={doc._id}> {doc.name} </option>                   
                                ))
                            }
                        </select>
                    </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => dispatch({type: 'ADD_MODAL', payload: []})}> Cancel </button>
                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={Submit}> Update Appointment </button>
                    </div>
                    </div>
                </div>
            </div>
        </div>
        {
          props.result < page * 20 ? ""
          : <button className='btn btn-outline-info d-block mx-auto mb-4' onClick={loadMore}> Load More </button>
        }
        </div>
    )
}

export async function getServerSideProps({query}) {

    const page = query.page || 1
    const category = query.category || 'all'
    const sort = query.sort || ''
    const search = query.search || 'all'
    const token = query.token

    const res = await getData(`appointment?limit=${page*20}&service=${category}&sort=${sort}&petName=${search}`, token)  
    // Server Side Rendering
    return{
        props: {
          appointment: res.appoint,
          result: res.result
        } // will be passed to the page component as props
      }
  }

export default Appointment