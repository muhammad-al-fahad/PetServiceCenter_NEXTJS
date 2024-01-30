import Head from 'next/head'
import Link from 'next/link'
import { useContext, useState, useEffect } from 'react'
import { DataContext } from '../redux/store'
import { postData } from '../utils/fetchData'
import { useRouter } from 'next/router'

const Home = () => {

    const initial = {
        timing: "",
        date: "",
        pet: "",
        service: "",
        doctor: ""
    }

    const [appoint, setAppoint] = useState(initial)
    const { state, dispatch } = useContext(DataContext)

    const [appointment, setAppointment] = useState([])
    const [doctorData, setDoctorData] = useState([])
    const [petData, setPetData] = useState([])
    const [petName, setPetName] = useState('')
    const [serviceData, setServiceData] = useState([])
    const [timeData, setTimeData] = useState([])

    const { timing, date, pet, service, doctor } = appoint
    const { auth, pets, timings, appointments, services, doctors, offers, member } = state

    const router = useRouter()
    const [detail, setDetail] = useState('')

    useEffect(() => {
        setDetail(member)
        console.log(detail);
    }, [member, auth.user])

    const Handle = (props) => {
        const { name, value } = props.target
        setAppoint({ ...appoint, [name]: value })
        dispatch({ type: 'NOTIFY', payload: {} })
    }

    const typesLink = (members) => {
        return (
            <>
                {
                    members.types.map(map => (
                        <div key={map._id} className='d-flex my-2'>
                            <i className='far fa-check-circle text-success'></i>
                            <p className='mx-3 my-0' title={map.name}>{map.name}</p>
                        </div>
                    ))
                }
            </>
        )
    }

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

        if(newPet.length !== 0) setPetName(newPet[0].petName)

    }, [appoint])

    const Submit = async (props) => {
        props.preventDefault()

        if (auth.user.role !== 'user' && auth.user.role !== 'membership')
            return dispatch({ type: 'NOTIFY', payload: { error: "Only user/ membership are allowed to book appointment" } })

        if (timing === 'all' || !date || pet === 'all' || service === 'all' || doctor === 'all' || !petName)
            return dispatch({ type: 'NOTIFY', payload: { error: "Please fill all the fields" } })

        dispatch({ type: 'NOTIFY', payload: { loading: true } })

        const res = await postData('appointment', { time: timing, timeData: timeData[0], service, serviceData: serviceData[0], doctor, doctorData: doctorData[0], date, pet, petData: petData[0], petName}, auth.token)

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
                <title> Pets Service Center </title>
            </Head>
            <div className = 'appointment'>
                <h3 className='pet-title'> we are here to serve you </h3>
                <div className = 'appoint'>
                    <p className='description'>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                    </p>
                    <img className='pet-image' src='appointment.jpg' alt='for_pet_book_appointment'/>
                </div>
                <button className = 'btn btn-danger w-25 book-appointment' style={{}} aria-hidden='true' data-bs-toggle="modal" data-bs-target="#appointmentModal"> Book Appointment </button>
            </div>
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
                                <label htmlFor='service' style={{ fontWeight: 'bold' }}> Service </label>
                                <select name='service' value={service} onChange={Handle} className="form-control text-capitalize mt-2 w-100">
                                    <option value='all'> All Services </option>
                                    {
                                        auth.user && (auth.user.role === 'user' || auth.user.role === 'membership') && services.map(doc => (
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
            <div className="d-block">
                <h2 className='my-4 col-md-4 offset-md-5 text-uppercase'> Our Services </h2>
                <div className='services'>
                    <div className="d-block" style={{ marginLeft: '15px' }}>
                        <img src='checkup.webp' alt='checkup.webp' width="150px" height="150px" style={{ marginLeft: '60px', objectFit: 'cover', borderWidth: '1px', borderRadius: '50%' }} />
                        <h5 className='text-uppercase my-2' style={{ marginLeft: '40px' }}> Checkup </h5>
                        <p style={{ width: '250px' }}>Your Pets Physical Checkup Listening to your animals lungs and heart. Checking your cat or dogs stance, gait, and weight.</p>
                    </div>
                    <div className="d-block" style={{ marginLeft: '15px' }}>
                        <img src='treatment.jpg' alt='treatment.jpg' width="150px" height="150px" style={{ marginLeft: '60px', objectFit: 'cover', borderWidth: '1px', borderRadius: '50%' }} />
                        <h5 className='text-uppercase my-2' style={{ marginLeft: '40px' }}> Treatment </h5>
                        <p style={{ width: '250px' }}>Your Pets treatment have any job that has to do with taking care of pets would be considered a pet care profession.</p>
                    </div>
                    <div className="d-block" style={{ marginLeft: '15px' }}>
                        <img src='vaccination.png' alt='vaccination.png' width="150px" height="150px" style={{ marginLeft: '60px', objectFit: 'cover', borderWidth: '1px', borderRadius: '50%' }} />
                        <h5 className='text-uppercase my-2' style={{ marginLeft: '40px' }}> Vaccination </h5>
                        <p style={{ width: '250px' }}>Pet vaccinations help protect your pet from diseases and illnesses that could threaten their health immediately and in the future.</p>
                    </div>
                    <div className="d-block" style={{ marginLeft: '15px' }}>
                        <img src='diagnostic_test.jpg' alt='diagnostic_test.jpg' width="150px" height="150px" style={{ marginLeft: '60px', objectFit: 'cover', borderWidth: '1px', borderRadius: '50%' }} />
                        <h5 className='text-uppercase my-2' style={{ marginLeft: '30px' }}> Diagnostic Test </h5>
                        <p style={{ width: '250px' }}>X-rays and ultrasound tests can indicate structural problems, injuries and other issues.</p>
                    </div>
                    <div className="d-block" style={{ marginLeft: '15px' }}>
                        <img src='home_visit.png' alt='home_visit.png' width="150px" height="150px" style={{ marginLeft: '60px', objectFit: 'cover', borderWidth: '1px', borderRadius: '50%' }} />
                        <h5 className='text-uppercase my-2' style={{ marginLeft: '40px' }}> Home Visit </h5>
                        <p style={{ width: '250px' }}>A Pet Home Visit is where a pet sitter will pop into your home as often as you require, throughout the day.</p>
                    </div>
                </div>
                <button className='btn btn-dark w-25' style={{marginLeft: '30%'}}><Link href="/"><a style={{textDecoration: 'none', color: 'white'}}> Take Service </a></Link></button>
            </div>
            <div className="d-block">
                <h2 className='my-4 col-md-4 offset-md-5 text-uppercase'> Our Doctors Team </h2>
                <div className='doctors-arrangement'>
                    <div className="d-block" style={{width: '300px', marginLeft: '15px' }}>
                        <img className='doctor-image' src={doctors.length >= 1 && doctors[0].avatar ? doctors[0].avatar : 'https://res.cloudinary.com/comsats-university-lahore/image/upload/v1659383317/Rehbar%20Pet%27s%20Clinic/profile_tird38.png'} alt={doctors.length >= 1 && doctors[0].avatar ? doctors[0].avatar : 'Loading...'}/>
                        <h4 className='text-uppercase my-2' style={{ textAlign: 'center' }}> {doctors.length >= 1 && doctors[0].name} </h4>
                        <h6 className='text-uppercase my-2' style={{ textAlign: 'center' }}> {doctors.length >= 1 && doctors[0].designation} </h6>
                        <p style={{ textAlign: 'center' }}>{doctors.length >= 1 && doctors[0].bio}</p>
                    </div>
                    <div className="d-block" style={{width: '300px', marginLeft: '15px' }}>
                        <img className='doctor-image' src={doctors.length >= 2 && doctors[1].avatar ? doctors[1].avatar : 'https://res.cloudinary.com/comsats-university-lahore/image/upload/v1659383317/Rehbar%20Pet%27s%20Clinic/profile_tird38.png'} alt={doctors.length >= 2 && doctors[1].avatar ? doctors[1].avatar : 'Loading...'}/>
                        <h4 className='text-uppercase my-2' style={{ textAlign: 'center' }}> {doctors.length >= 2 && doctors[1].name} </h4>
                        <h6 className='text-uppercase my-2' style={{ textAlign: 'center' }}> {doctors.length >= 2 && doctors[1].designation} </h6>
                        <p style={{ textAlign: 'center' }}>{doctors.length >= 2 && doctors[1].bio}</p>
                    </div>
                    <div className="d-block" style={{width: '300px', marginLeft: '15px' }}>
                        <img className='doctor-image' src={doctors.length >= 3 && doctors[2].avatar ? doctors[2].avatar : 'https://res.cloudinary.com/comsats-university-lahore/image/upload/v1659383317/Rehbar%20Pet%27s%20Clinic/profile_tird38.png'} alt={doctors.length >= 3 && doctors[2].avatar ? doctors[2].avatar : 'Loading...'}/>
                        <h4 className='text-uppercase my-2' style={{ textAlign: 'center' }}> {doctors.length >= 3 && doctors[2].name} </h4>
                        <h6 className='text-uppercase my-2' style={{ textAlign: 'center' }}> {doctors.length >= 3 && doctors[2].designation} </h6>
                        <p style={{ textAlign: 'center' }}>{doctors.length >= 3 && doctors[2].bio}</p>
                    </div>
                </div>
                <button className='btn btn-dark w-25' style={{marginLeft: '30%'}}><Link href="/doctors"><a style={{textDecoration: 'none', color: 'white'}}> View Doctors </a></Link></button>
            </div>
            <div>
                {offers.length !== 0 && 
                    <div>
                        <h2 className='my-4 col-md-4 offset-md-5 text-uppercase'> Membership Status </h2>
                        <img src={offers[0].poster} alt={offers[0].poster} width="80%" height="300px" style={{ objectFit: 'cover' }} />
                    </div>
                }
            </div>
            <div className="d-block">   
                { detail.length > 0 && 
                    <div className='membership'>
                        <h2 className='my-4 col-md-4 offset-md-5 text-uppercase'> Membership </h2>
                        {
                            detail.map(item => (
                                <div key={item._id} className="card" style={{width: '27rem', marginLeft: '30px'}}>
                                    <img src={item.image} className = "card-img-top" alt = {item.image}/>
                                    <div className="card-body">
                                        <h5 className="card-title text-capitalize" title={item.title}>{item.title}</h5>
                                        
                                        <h6 className="text-danger" style={{flex:1}}> ${item.price}/{item.day}</h6>

                                        <p className="card-text" title={item.description}>{item.description}</p>

                                        <div className="column justify-content-start my-0">
                                            {item.types && typesLink(item)}
                                        </div>            
                                    </div>

                                    <div className="row justify-content-between mx-1 my-4">
                                        <button className='btn btn-dark w-50' style={{marginLeft: '20%'}}><Link href={`/memberships/${item._id}`}><a style={{textDecoration: 'none', color: 'white'}}> Proceed Payment </a></Link></button>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                }
            </div>
        </div>
    )
}

export default Home;