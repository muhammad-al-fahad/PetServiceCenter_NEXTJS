import Head from 'next/head'
import Link from 'next/link'
import { useContext, useState, useEffect } from 'react'
import { DataContext } from '../redux/store'
import { postData } from '../utils/fetchData'
import { useRouter } from 'next/router'

const Service = () => {
    const initial = {
        timing: "",
        date: "",
        pet: "",
        doctor: ""
    }

    const [appoint, setAppoint] = useState(initial)
    const { state, dispatch } = useContext(DataContext)

    const [service, setService] = useState('')

    const [appointment, setAppointment] = useState([])
    const [doctorData, setDoctorData] = useState([])
    const [petData, setPetData] = useState([])
    const [serviceData, setServiceData] = useState([])
    const [timeData, setTimeData] = useState([])

    const { timing, date, pet, doctor } = appoint
    const { auth, pets, timings, appointments, services, doctors, modal} = state

    const Handle = (props) => {
        const { name, value } = props.target
        setAppoint({ ...appoint, [name]: value })
        dispatch({ type: 'NOTIFY', payload: {} })
    }

    useEffect(() => {
        if(modal.length !== 0) setService(modal[0]._id)
    }, [modal])

    useEffect(() => {

        let times = [...timings]

        appointments.map(appoint => {
            if (doctor && date && appoint.doctor === doctor && appoint.date === new Date(date).toISOString()) {
                for (var i = times.length - 1; i >= 0; i--) {
                    if (times[i] && (times[i]._id === appoint.time)) {
                        times.splice(i, 1);
                    }
                }
            }
        })

        setAppointment(times)
    }, [doctor, date])

    useEffect(() => {

        let newDoctor = [];
        let newPet = [];
        let newService = [];
        let newTime = [];

        pet && pets.map(p => {
            if (p._id === pet) newPet.push(p)
        })

        doctor && doctors.map(d => {
            if (d._id === doctor) newDoctor.push(d)
        })

        service && services.map(s => {
            if (s._id === service) newService.push(s)
        })

        timing && timings.map(t => {
            if (t._id === timing) newTime.push(t)
        })

        setDoctorData(newDoctor)
        setPetData(newPet)
        setServiceData(newService)
        setTimeData(newTime)

    }, [appoint])

    const Submit = async (props) => {
        props.preventDefault()

        if (auth.user.role !== 'user' && auth.user.role !== 'membership')
            return dispatch({ type: 'NOTIFY', payload: { error: "Only user/ membership are allowed to book appointment" } })

        if (timing === 'all' || !date || pet === 'all' || service === 'all' || doctor === 'all')
            return dispatch({ type: 'NOTIFY', payload: { error: "Please fill all the fields" } })

        dispatch({ type: 'NOTIFY', payload: { loading: true } })

        const res = await postData('appointment', { time: timing, timeData: timeData[0], service, serviceData: serviceData[0], doctor, doctorData: doctorData[0], date, pet, petData: petData[0] }, auth.token)

        if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })

        dispatch({ type: 'ADD_APPOINTMENTS', payload: [...appointments, res.newAppoint] })

        dispatch({ type: 'NOTIFY', payload: { success: res.msg } })

        setAppoint(initial)
        setAppointment([])
        setDoctorData([])
        setPetData([])
        setServiceData([])
        setTimeData([])
    }

    return (
        <div> 
            <Head>
                <title> Services </title>
            </Head>
            { services.map(ser => (
                ser.name === 'Check Up' && <div key={ser._id} className="d-block col-md-6 offset-md-4 my-4">
                    <img src='checkup.webp' alt='checkup.webp' width="30%" height="30%" style={{objectFit: 'cover', borderWidth: '1px', borderRadius: '50%' }} />
                    <h3 className='text-uppercase my-2' style={{ marginLeft: '40px' }}> Checkup </h3>
                    <p style={{ width: '250px' }}>Your Pets Physical Checkup Listening to your animals lungs and heart. Checking your cat or dogs stance, gait, and weight.</p>
                    <button className = 'btn btn-primary w-25' style={{boxShadow: '0 5px 10px rgba(255,0,0,0.5)', marginTop: '20px', marginBotton: '30px'}} aria-hidden='true' data-bs-toggle="modal" data-bs-target="#appointmentModal" onClick={() => dispatch({type: 'ADD_MODAL', payload: [{data: services, _id: ser._id, title: ser.name}]})}> Take Service </button>
                </div>
                ))
            }
            { services.map(ser => (
                ser.name === 'Treatment' && <div key={ser._id} className="d-block col-md-6 offset-md-4 my-4">
                    <img src='treatment.jpg' alt='treatment.jpg' width="30%" height="30%" style={{ objectFit: 'cover', borderWidth: '1px', borderRadius: '50%' }} />
                    <h5 className='text-uppercase my-2' style={{ marginLeft: '40px' }}> Treatment </h5>
                    <p style={{ width: '250px' }}>Your Pets treatment have any job that has to do with taking care of pets would be considered a pet care profession.</p>
                    <button className = 'btn btn-primary w-25' style={{boxShadow: '0 5px 10px rgba(255,0,0,0.5)', marginTop: '20px', marginBotton: '30px'}} aria-hidden='true' data-bs-toggle="modal" data-bs-target="#appointmentModal" onClick={() => dispatch({type: 'ADD_MODAL', payload: [{data: services, _id: ser._id, title: ser.name}]})}> Take Service </button>
                </div>
                ))
            }
            { services.map(ser => (
                ser.name === 'Vaccination' && <div key={ser._id} className="d-block col-md-6 offset-md-4 my-4">
                    <img src='vaccination.png' alt='vaccination.png' width="30%" height="30%" style={{ objectFit: 'cover', borderWidth: '1px', borderRadius: '50%' }} />
                    <h5 className='text-uppercase my-2' style={{ marginLeft: '40px' }}> Vaccination </h5>
                    <p style={{ width: '250px' }}>Pet vaccinations help protect your pet from diseases and illnesses that could threaten their health immediately and in the future.</p>
                    <button className = 'btn btn-primary w-25' style={{boxShadow: '0 5px 10px rgba(255,0,0,0.5)', marginTop: '20px', marginBotton: '30px'}} aria-hidden='true' data-bs-toggle="modal" data-bs-target="#appointmentModal" onClick={() => dispatch({type: 'ADD_MODAL', payload: [{data: services, _id: ser._id, title: ser.name}]})}> Take Service </button>
                </div>
                ))
            }
            { services.map(ser => (
                ser.name === 'Diagnostic Test' && <div key={ser._id} className="d-block col-md-6 offset-md-4 my-4">
                    <img src='diagnostic_test.jpg' alt='diagnostic_test.jpg' width="30%" height="30%" style={{ objectFit: 'cover', borderWidth: '1px', borderRadius: '50%' }} />
                    <h5 className='text-uppercase my-2' style={{ marginLeft: '30px' }}> Diagnostic Test </h5>
                    <p style={{ width: '250px' }}>X-rays and ultrasound tests can indicate structural problems, injuries and other issues.</p>
                    <button className = 'btn btn-primary w-25' style={{boxShadow: '0 5px 10px rgba(255,0,0,0.5)', marginTop: '20px', marginBotton: '30px'}} aria-hidden='true' data-bs-toggle="modal" data-bs-target="#appointmentModal" onClick={() => dispatch({type: 'ADD_MODAL', payload: [{data: services, _id: ser._id, title: ser.name}]})}> Take Service </button>
                </div>
                ))
            }
            { services.map(ser => (
                ser.name === 'Home Visit' && <div key={ser._id} className="d-block col-md-6 offset-md-4 my-4">
                    <img src='home_visit.png' alt='home_visit.png' width="30%" height="30%" style={{objectFit: 'cover', borderWidth: '1px', borderRadius: '50%' }} />
                    <h5 className='text-uppercase my-2' style={{ marginLeft: '40px' }}> Home Visit </h5>
                    <p style={{ width: '250px' }}>A Pet Home Visit is where a pet sitter will pop into your home as often as you require, throughout the day.</p>
                    <button className = 'btn btn-primary w-25' style={{boxShadow: '0 5px 10px rgba(255,0,0,0.5)', marginTop: '20px', marginBotton: '30px'}} aria-hidden='true' data-bs-toggle="modal" data-bs-target="#appointmentModal" onClick={() => dispatch({type: 'ADD_MODAL', payload: [{data: services, _id: ser._id, title: ser.name}]})}> Take Service </button>
                </div>
                ))
            }

                <div className="modal fade" id="appointmentModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title text-capitalize" id="exampleModalLabel"> Appointment </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                        <form className='col-md-12 my-4 mx-0' onSubmit={Submit}>
                            <div className='form-group d-block'>

                                <div className='form-group input-group-prepend my-4'>
                                    <label htmlFor='pet' style={{ fontWeight: 'bold' }}> Pet </label>
                                    <select name='pet' value={pet} onChange={Handle} className="form-control text-capitalize mt-2 w-100">
                                        <option value='all'> All Pets </option>
                                        {
                                            auth.user && (auth.user.role === 'user' || auth.user.role === 'membership') && pets.map(animal => (
                                                <option key={animal._id} value={animal._id}> {animal.petName} </option>
                                            ))
                                        }
                                    </select>
                                </div>

                                <div className='form-group input-group-prepend my-4'>
                                    <label htmlFor='doctor' style={{ fontWeight: 'bold' }}> Doctor </label>
                                    <select name='doctor' value={doctor} onChange={Handle} className="form-control text-capitalize mt-2 w-100">
                                        <option value='all'> All Doctors </option>
                                        {
                                            doctors.map(doc => (
                                                <option key={doc._id} value={doc._id}> {doc.name} </option>
                                            ))
                                        }
                                    </select>
                                </div>

                                <div className='form-group input-group-prepend my-4'>
                                    <label htmlFor='date' style={{ fontWeight: 'bold' }}> Date </label>
                                    <input type="date" id="date" className="form-control mt-2" name='date' value={date} disabled={auth.user && (auth.user.role === 'user' || auth.user.role === 'membership') ? false : true} onChange={Handle} />
                                </div>

                                <div className='form-group input-group-prepend my-4'>
                                    <label htmlFor='timing' style={{ fontWeight: 'bold' }}> Time </label>
                                    <select name='timing' value={timing} onChange={Handle} className="form-control text-capitalize mt-2 w-100">
                                        <option value='all'> All Timing </option>
                                        {
                                            auth.user && (auth.user.role === 'user' || auth.user.role === 'membership') && appointment.map(doc => (
                                                <option key={doc._id} value={doc._id}> {doc.name} </option>
                                            ))
                                        }
                                    </select>
                                </div>

                            </div>
                            <button type='submit' className='btn btn-info my-4 w-50' style={{ color: 'white', marginLeft: '25%' }}> Submit </button>
                        </form>
                        </div>
                    </div>
                </div>

                </div>
            </div>
    )
}

export default Service