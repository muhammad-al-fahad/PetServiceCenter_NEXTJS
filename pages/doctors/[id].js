import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect, useContext } from 'react'
import { getData, postData } from '../../utils/fetchData'
import { DataContext } from '../../redux/store'

const Detail = (props) => {

    const initial = {
        timing: "",
        date: "",
        pet: "",
        service: ""
     }

     const [doctor, setDoctor] = useState(props.doctor)
     const {state, dispatch} = useContext(DataContext)

     const [appoint, setAppoint] = useState(initial)
     const {timing, date, pet, service} = appoint

     const [process, setProcess] = useState(0)
     const [completed, setCompleted] = useState(0)
     const [pending, setPending] = useState(0)

     const {auth, pets, timings, appointments, services, modal, doctors, bills} = state

     const [appointment, setAppointment] = useState([])
     const [doctorData, setDoctorData] = useState([])
     const [petData, setPetData] = useState([])
     const [serviceData, setServiceData] = useState([])
     const [timeData, setTimeData] = useState([])

     const Handle = (props) => {
        const {name, value} = props.target
        setAppoint({...appoint, [name]: value})
        dispatch({type: 'NOTIFY', payload: {}})
     }

     useEffect(() => {
        let len = [];
        let pen = [];

        appointments.map(app => {
            app.accept && doctor._id === app.doctor ? len.push({...len, app}) : len
        })

        appointments.map(app => {
            !app.accept && doctor._id === app.doctor ? pen.push({...pen, app}) : pen
        })

        setProcess(len.length)
        setPending(pen.length)
     }, [appointments])

     useEffect(() => {
        let len = [];

        bills.map(app => {
            app.paid && doctor._id === app.doctor ? len.push({...len, app}) : len
        })

        setCompleted(len.length)
     }, [bills])

     useEffect(() => {

        let newPet = [];
        let newService = [];
        let newTime = [];

        pet && pets.map(p => {
            if(p._id === pet) newPet.push(p)
        })

        service && services.map(s => {
            if(s._id === service) newService.push(s)
        })

        timing && timings.map(t => {
            if(t._id === timing) newTime.push(t)
        })

        setDoctorData(doctor)
        setPetData(newPet)
        setServiceData(newService)
        setTimeData(newTime)

     }, [appoint, modal])

     useEffect(() => {

        let times = [...timings]

        appointments.map(appoint => {
            if(modal.length !== 0 && date && appoint.doctor === modal[0].id && appoint.date === new Date(date).toISOString()){
                for( var i=times.length - 1; i>=0; i--){
                    if(times[i] && (times[i]._id === appoint.time)){
                        times.splice(i, 1);
                    }
                }
            }
        })

        setAppointment(times)
     }, [modal, date])

     const Submit = async (props) => {
        props.preventDefault()

        if(auth.user.role !== 'user' && auth.user.role !== 'membership') 
            return dispatch({type: 'NOTIFY', payload: {error: "Only user/ membership are allowed to book appointment"}})

        if(timing === 'all' || !date || pet === 'all' || service === 'all')
            return dispatch({type: 'NOTIFY', payload: {error: "Please fill all the fields"}})

        dispatch({type: 'NOTIFY', payload: {loading: true}})

        const res = await postData('appointment', {time: timing, timeData: timeData[0], service, serviceData: serviceData[0], doctor, doctorData, date, pet, petData: petData[0]}, auth.token)

        if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})

        dispatch({ type: 'ADD_APPOINTMENTS', payload: [...appointments, res.newAppoint]})

        dispatch({ type: 'NOTIFY', payload: {success: res.msg}})

        setAppoint(initial)
        setAppointment([])
        setDoctorData([])
        setPetData([])
        setServiceData([])
        setTimeData([])
    }

    if(auth.user && (auth.user.role !== 'user' && auth.user.role !== 'membership')) return null
    return (
        <div>
            <Head>
                <title>
                    Detail Doctor
                </title>
            </Head>
            <div key={doctor._id} className='detail_page'>
                <div className='col-md-4 offset-md-1 my-4'>
                  <img src={doctor.avatar} alt={doctor.avatar} className="d-block mt-4 mx-auto" width="220px" height="220px" style={{borderWidth: "1px",  borderRadius: "50%", objectFit: "cover"}}/>
                </div>

                <div className='my-4 col-md-10 offset-md-1'>
                    <h2 className='text-uppercase mx-5'>{doctor.name}</h2>
                    <div className='d-block justify-content-between mx-5'>
                      <h6 className='text-secondary my-4' style={{flex: 1}}> Designation: {doctor.designation}</h6>
                      <h6 className='text-secondary my-4' style={{flex: 1}}> Appointment: completed: {completed} process: {process} pending: {pending}</h6>
                    </div>
                    <h6 className='text-secondary my-4 mx-5'>Birth: {new Date(doctor.dateofbirth).toLocaleDateString()}</h6>
                    <h6 className='text-secondary my-4 mx-5'>Contact: {doctor.contact}</h6>
                    <div className='my-4 mx-5'>
                      <h5> About Doctor </h5>
                      <p className='my-2'>{doctor.bio}</p>
                    </div>

                    <div className='row mx-5'>
                    <Link href={`/doctors/address/${doctor._id}`}>
                        <a><button className='btn btn-primary w-25 text-light'> Get Address Location </button></a>
                    </Link>
                        <a><button className='btn btn-success w-25 my-4' aria-hidden='true' data-bs-toggle="modal" data-bs-target="#appointmentModal" onClick={() => dispatch({type: 'ADD_MODAL', payload: [{data: doctors, id: doctor._id, title: doctor.name, type: 'ADD_APPOINTMENTS'}]})}> Book Appointment </button></a>
                    </div>
                </div>

                <div className="modal fade" id="appointmentModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title text-capitalize" id="exampleModalLabel"> {modal.length !== 0 && modal[0].title} </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">

                        <div className='form-group input-group-prepend mx-4 my-4'>
                            <label htmlFor='pet' style={{fontWeight: 'bold'}}> Pet </label>
                            <select name='pet' value={pet} onChange={Handle} className="form-control text-capitalize mt-4 w-100">
                                <option value='all'> All Pets </option>
                                {
                                    pets.map(animal => (
                                        <option key={animal._id} value={animal._id}> {animal.petName} </option>
                                    ))
                                }
                            </select>
                        </div>

                        <div className='form-group input-group-prepend mx-4 my-4'>
                            <label htmlFor='service' style={{fontWeight: 'bold'}}> Service </label>
                            <select name='service' value={service} onChange={Handle} className="form-control text-capitalize mt-4 w-100">
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
                            <select name='timing' value={timing} onChange={Handle} className="form-control text-capitalize mt-4 w-100">
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
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"> Cancel </button>
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={Submit}> Book Appointment </button>
                        </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export async function getServerSideProps({params: {id}}) {
    const res = await getData(`user/${id}`)
    // Server Side Rendering
      return{
        props: {
          doctor: res.user
        }, // will be passed to the page component as props
      }
  }

export default Detail