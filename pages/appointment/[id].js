import Head from 'next/head'
import Link from 'next/link'
import {useState, useContext, useEffect} from 'react'
import { getData, patchData } from '../../utils/fetchData'
import { DataContext } from '../../redux/store'
import Stripe from '../../components/visitStripe'

const Detail = (props) => {

    const [appointment, setAppointment] = useState(props.appointment)
    const [service, setService] = useState([])
    const [tab, setTab] = useState(0)
    const [category, setCategory] = useState('')

    const {state, dispatch} = useContext(DataContext)
    const {auth, checkup_service, treatment_service, vaccination_service, diagnostic_test_service, home_visit_service, petCategories} = state

    const isActive = (index) => {
        if(tab === index) return "active";
        return ""
    }

    useEffect(() => {
        if(appointment.serviceData[0].name === 'Check Up'){
            checkup_service.map(serve => {
                if(serve.appointment === appointment._id) setService(serve)
            })
        }else if(appointment.serviceData[0].name === 'Treatment'){
            treatment_service.map(serve => {
                if(serve.appointment === appointment._id) setService(serve)
            })
        }else if(appointment.serviceData[0].name === 'Vaccination'){
            vaccination_service.map(serve => {
                if(serve.appointment === appointment._id) setService(serve)
            })
        }else if(appointment.serviceData[0].name === 'Diagnostic Test'){
            diagnostic_test_service.map(serve => {
                if(serve.appointment === appointment._id) setService(serve)
            })
        }else if(appointment.serviceData[0].name === 'Home Visit'){
            home_visit_service.map(serve => {
                if(serve.appointment === appointment._id) setService(serve)
            })
        }

        console.log(service)
        
    }, [checkup_service, treatment_service, vaccination_service, home_visit_service, diagnostic_test_service])

    useEffect(() => {
        petCategories.map(category => {
            if(category._id === appointment.petData[0].petCategory) setCategory(category.name)
        })
    }, [appointment, petCategories])

    const Accept = () => {
        dispatch({type: 'NOTIFY', payload: {loading: true}})
        patchData(`appointment/accept/${appointment._id}`, null, auth.token).then(res => {
            if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})
            return dispatch({type: 'NOTIFY', payload: {success: res.msg}})
        })
    }

    const transForm = {
        display: service.length !== 0 ? "none" : "flex"
    }

    if(!auth.user) return null
    return (
        <div> 
            <Head>
                <title> Detail Appointment </title>
            </Head>
            <div className='row detail_page justify-content-center'>
                <div className='col-md-4 offset-md-1 mx-3'>
                <img src={appointment.petData[0].images[tab].url} alt={appointment.petData[0].images[tab].url} className="d-block img-thumbnail rounded mt-4 w-100" style={{height: '350px'}}/>
                <div className='row mx-0' style={{cursor: 'pointer'}}>
                {appointment.petData[0].images.map((img, index) => (
                        <img key={index} src={img.url} alt={img.url} className={`img-thumbnail rounded ${isActive(index)}`} style={{height: '80px', width: '20%', objectFit: 'cover'}} onClick = {() => setTab(index)} />
                ))}
                </div>
                <div className={`alert ${appointment.accept ? 'alert-success' : 'alert-danger'} d-flex align-items-center justify-content-between my-4`} role='alert'>
                    {
                        appointment.accept ? ` Appointment Accepted at ${new Date(appointment.updatedAt).toLocaleDateString()}` : 'Appointment Not Accepted'
                    }
                    {
                        auth.user.role === 'doctor' && !appointment.accept &&
                        <button className='btn btn-dark text-uppercase' onClick={Accept}> Mark as Accept </button>
                    }
                </div>
                {appointment.accept && auth.user.role !== 'doctor' && <Link href={appointment.serviceData[0].name === 'Check Up' ? `/checkup/service?appoint=${appointment._id}` : appointment.serviceData[0].name === 'Treatment' ? `/treatment/service?appoint=${appointment._id}` : appointment.serviceData[0].name === 'Vaccination' ? `/vaccination/service?appoint=${appointment._id}` : appointment.serviceData[0].name === 'Diagnostic Test' ? `/diagnostic_test/service?appoint=${appointment._id}` : `/home_visit/service?appoint=${appointment._id}`}><button className='btn btn-success text-light w-100 my-4' style={transForm}> Enter Futher Information About {appointment.serviceData[0].name} </button></Link>}
                {appointment.accept && service.length !== 0 && auth.user.role === 'doctor' && <Link href={appointment.serviceData[0].name === 'Check Up' ? `/checkup/result/physical?appoint=${appointment._id}` : appointment.serviceData[0].name === 'Treatment' ? `/treatment/result?appoint=${appointment._id}` : appointment.serviceData[0].name === 'Vaccination' && category === 'Dog' ? `/vaccination/result/dog_disease?appoint=${appointment._id}` : appointment.serviceData[0].name === 'Vaccination' && category === 'Cat' ? `/vaccination/result/cat_disease?appoint=${appointment._id}` : appointment.serviceData[0].name === 'Diagnostic Test' ? `/diagnostic_test/result?appoint=${appointment._id}` : `/home_visit/result?appoint=${appointment._id}`}><button className='btn btn-success text-light w-100 my-4'> Create Result of {appointment.serviceData[0].name} </button></Link>}
                </div>

                <div className='col-md-6 offset-md-1 my-4'>
                <h2 className='text-uppercase' style={{marginLeft: '-75px'}}> {auth.user.role === 'doctor' ? 'Client Information' : 'Doctor Information'} </h2>
                <img className='my-4' src={auth.user.role === 'doctor' ? appointment.petData[0] && appointment.petData[0].userDetail[0].avatar : appointment.doctorData[0] && appointment.doctorData[0].avatar} alt={auth.user.role === 'doctor' ? appointment.user.avatar : appointment.doctorData[0].avatar} width='150px' height='150px' style={{borderRadius: '50%', objectFit: 'cover'}}/>
                <p> Name: {auth.user.role === 'doctor' ? appointment.petData[0] && appointment.petData[0].userDetail[0].name : appointment.doctorData[0] && appointment.doctorData[0].name}</p>
                <p> Email: {auth.user.role === 'doctor' ? appointment.petData[0] && appointment.petData[0].userDetail[0].email : appointment.doctorData[0] && appointment.doctorData[0].email}</p>
                <p> Address: {auth.user.role === 'doctor' ? appointment.petData[0] && appointment.petData[0].userDetail[0].address : appointment.doctorData[0] && appointment.doctorData[0].address}</p>
                <p> Contact: {auth.user.role === 'doctor' ? appointment.petData[0] && appointment.petData[0].userDetail[0].contact : appointment.doctorData[0] && appointment.doctorData[0].contact}</p>
                <p> CNIC: {auth.user.role === 'doctor' ? appointment.petData[0] && appointment.petData[0].userDetail[0].cnic : appointment.doctorData[0] && appointment.doctorData[0].cnic}</p>
                <p> Birth: {auth.user.role === 'doctor' ? appointment.petData[0] && new Date(appointment.petData[0].userDetail[0].dateofbirth).toDateString() : appointment.doctorData[0] && new Date(appointment.doctorData[0].dateofbirth).toDateString()}</p>
                <p> Role: {auth.user.role === 'doctor' ? appointment.petData[0] && appointment.petData[0].userDetail[0].role : appointment.doctorData[0] && appointment.doctorData[0].role}</p>

                <h2 className='text-uppercase my-4' style={{marginLeft: '-75px'}}> Pet Information </h2>
                <p> Name: {appointment.petData[0] && appointment.petData[0].petName}</p>
                <p> Category: {category}</p>
                <p> Sex: {appointment.petData[0] && appointment.petData[0].petSex}</p>
                <p> Birth: {appointment.petData[0] && new Date(appointment.petData[0].dateofbirth).toDateString()}</p>
                <p> Age: {appointment.petData[0] && appointment.petData[0].age}</p>
                <p> Bio: {appointment.petData[0] && appointment.petData[0].bio}</p>
                <p> Disease: {appointment.petData[0] && appointment.petData[0].disease.length === 0 ? `N/A` : appointment.petData[0].disease}</p>

                { appointment.serviceData[0].name === 'Check Up' && service.length !== 0 && service.appointment === appointment._id && <>
                    <h2 className='text-uppercase my-4' style={{marginLeft: '-75px'}}> {appointment.serviceData[0].name} {(auth.user.role === 'user' || auth.user.role === 'membership') && <Link href={`/checkup/service/${service._id}`}><i className='fas fa-edit text-info mx-4' style={{cursor: "pointer"}}></i></Link>}</h2>
                    <p> Body Condition: {service.body_condition}</p>
                    <p> Body Condition Score: {service.body_condition_score}</p>
                    <p> Behavior: {service.behavior}</p>
                    <p> Posture: {service.posture}</p>
                    <p> Gait: {service.gait}</p>
                    <p> Defecation: {service.defecation}</p>
                    <p> Urination: {service.urination}</p>
                    <p> Voice: {service.voice}</p>
                    <p> Cough: {service.cough}</p>
                </>
                }
                { appointment.serviceData[0].name === 'Treatment' && service.length !== 0 && service.appointment === appointment._id && <>
                    <h2 className='text-uppercase my-4' style={{marginLeft: '-75px'}}> {appointment.serviceData[0].name} {(auth.user.role === 'user' || auth.user.role === 'membership') && <Link href={`/treatment/service/${service._id}`}><i className='fas fa-edit text-info mx-4' style={{cursor: "pointer"}}></i></Link>}</h2>
                    <p> Major Complain: {service.complain}</p>
                    <p> Temperature: Pulse Rate = {service.temperature[0].pulse} Heart Rate = {service.temperature[0].heart} Respiratory Rate = {service.temperature[0].respiratory}</p>
                    <p> Food Intake: {service.food ? <i className='fas fa-check-circle text-success'></i> : <i className='fas fa-times-circle text-danger'></i>}</p>
                    <p> Water Intake: {service.water ? <i className='fas fa-check-circle text-success'></i> : <i className='fas fa-times-circle text-danger'></i>}</p>
                    <p> Vomitting: {service.vomitting ? <i className='fas fa-check-circle text-success'></i> : <i className='fas fa-times-circle text-danger'></i>}</p>
                    <p> Coughing: {service.coughing ? <i className='fas fa-check-circle text-success'></i> : <i className='fas fa-times-circle text-danger'></i>}</p>
                    <p> Sneezing: {service.vomitting ? <i className='fas fa-check-circle text-success'></i> : <i className='fas fa-times-circle text-danger'></i>}</p>
                    <p> Nasal Discharge: {service.nasal ? <i className='fas fa-check-circle text-success'></i> : <i className='fas fa-times-circle text-danger'></i>}</p>
                    <p> Occular Discharge: {service.occular ? <i className='fas fa-check-circle text-success'></i> : <i className='fas fa-times-circle text-danger'></i>}</p>
                    <p> Dehydration %: {service.dehydration} %</p>
                    <p> CRT: {service.crt}</p>
                    <p> Mucus Membrane: {service.mucus_membrane}</p>
                    <p> Facal Examination: {service.facal}</p>
                    <p> Urine Examination: {service.urine}</p>
                    
                </>
                }
                { appointment.serviceData[0].name === 'Vaccination' && service.length !== 0 && service.appointment === appointment._id && <>
                    <h2 className='text-uppercase my-4' style={{marginLeft: '-75px'}}> {appointment.serviceData[0].name} {(auth.user.role === 'user' || auth.user.role === 'membership') && <Link href={`/vaccination/service/${service._id}`}><i className='fas fa-edit text-info mx-4' style={{cursor: "pointer"}}></i></Link>}</h2>
                    <p> Purpose: {service.purpose}</p>
                    <h6 className="mx-0"> Checkup Result</h6>
                    <p style={{marginLeft: '15px'}}> physical result: {service.checkup_result[0].physical}</p>
                    <p style={{marginLeft: '15px'}}> visual result: {service.checkup_result[0].visual}</p>
                    <p> Dose: {service.dose}</p>
                    <p> No of doses: {service.no_of_doses}</p>
                    <p> Repeat Doses: {service.repeat_doses ? <i className='fas fa-check-circle text-success'></i> : <i className='fas fa-times-circle text-danger'></i>}</p>
                    <p> Interval Between Repeat/day: {service.interval}/day</p>
                    <p> Diagnostic Test: {service.diagnostic_test}</p>
                    
                </>
                }
                { appointment.serviceData[0].name === 'Diagnostic Test' && service.length !== 0 && service.appointment === appointment._id && <>
                    <h2 className='text-uppercase my-4' style={{marginLeft: '-75px'}}> {appointment.serviceData[0].name} {(auth.user.role === 'user' || auth.user.role === 'membership') && <Link href={`/diagnostic_test/service/${service._id}`}><i className='fas fa-edit text-info mx-4' style={{cursor: "pointer"}}></i></Link>}</h2>
                    <p> Purpose: {service.purpose}</p>
                    <p> Test: {service.test}</p>
                    <p> General Physician Test: {service.physician_test}</p>
                    <p> Cardiology Test: {service.cardiology_test}</p>
                    <p> Neptrology Test: {service.neptrology_test}</p>
                    <h4> Signs of pet </h4>
                    <p> Lethargy: {service.signs_pet[0].lethargy ? <i className='fas fa-check-circle text-success'></i> : <i className='fas fa-times-circle text-danger'></i>}</p>
                    <p> Fatigue: {service.signs_pet[0].fatigue ? <i className='fas fa-check-circle text-success'></i> : <i className='fas fa-times-circle text-danger'></i>}</p>
                    <p> Persistant Cough: {service.signs_pet[0].persistant_cough ? <i className='fas fa-check-circle text-success'></i> : <i className='fas fa-times-circle text-danger'></i>}</p>
                    <p> Loss Appetite: {service.signs_pet[0].loss_appetite ? <i className='fas fa-check-circle text-success'></i> : <i className='fas fa-times-circle text-danger'></i>}</p>
                    <p> Swollen Abdomen: {service.signs_pet[0].swollen_abdomen ? <i className='fas fa-check-circle text-success'></i> : <i className='fas fa-times-circle text-danger'></i>}</p>
                    <p> Heat Failure: {service.signs_pet[0].heat_failure ? <i className='fas fa-check-circle text-success'></i> : <i className='fas fa-times-circle text-danger'></i>}</p>
                    <p> Weight Loss: {service.signs_pet[0].weight_loss ? <i className='fas fa-check-circle text-success'></i> : <i className='fas fa-times-circle text-danger'></i>}</p>
                    <p> Reluctance Excercise: {service.signs_pet[0].reluctance_excercise ? <i className='fas fa-check-circle text-success'></i> : <i className='fas fa-times-circle text-danger'></i>}</p>
                    <p> Hair Loss: {service.signs_pet[0].hair_loss ? <i className='fas fa-check-circle text-success'></i> : <i className='fas fa-times-circle text-danger'></i>}</p>
                    <p> Increase Urination: {service.signs_pet[0].increase_urination ? <i className='fas fa-check-circle text-success'></i> : <i className='fas fa-times-circle text-danger'></i>}</p>
                    <p> Decrease Appetite: {service.signs_pet[0].decrease_appetite ? <i className='fas fa-check-circle text-success'></i> : <i className='fas fa-times-circle text-danger'></i>}</p>
                    <p> Billing Own Skin: {service.signs_pet[0].billing_skin ? <i className='fas fa-check-circle text-success'></i> : <i className='fas fa-times-circle text-danger'></i>}</p>
                    
                </>
                }
                { appointment.serviceData[0].name === 'Home Visit' && service.length !== 0 && service.appointment === appointment._id && <>
                    <h2 className='text-uppercase my-4' style={{marginLeft: '-75px'}}> {appointment.serviceData[0].name} {(auth.user.role === 'user' || auth.user.role === 'membership') && <Link href={`/home_visit/service/${service._id}`}><i className='fas fa-edit text-info mx-4' style={{cursor: "pointer"}}></i></Link>}</h2>
                    <p> Type Visit: {service.type_visit}</p>
                    <p> Purpose: {service.purpose}</p>
                    { service.type_visit === 'price' && <div>
                        <h4> Price Of Visit </h4>
                        <p> ID: {service.visit_price[0].Id}</p>
                        <p> Distance: {service.visit_price[0].distance}</p>
                        <p> Area: {service.visit_price[0].area}</p>
                        <p> Price: ${service.visit_price[0].price}</p>


                        {
                            service.paid && service.method && <h6 className='my-2'>Method: <em>{service.method}</em></h6>
                        }
                          
                        {
                            service.paid && service.paymentID && <p className='my-2'>PaymentID: <em>{service.paymentID}</em></p>
                        }
                        <div className={`alert ${service.paid ? 'alert-success' : 'alert-danger'} d-flex align-items-center justify-content-between`} role='alert'>
                            {
                                service.paid ? ` Paid at ${new Date(service.dateOfPayment).toLocaleDateString()}` : (auth.user.role === 'user' || auth.user.role === 'membership') ? <Stripe service={service}/> : 'Not Paid by User'
                            }
                        </div>

                    </div>
                    }
                    
                </>
                }    
                </div>
            </div>
        </div>
    )
}

export async function getServerSideProps({params: {id}}) {

    const res = await getData(`appointment/${id}`)
    // Server Side Rendering
      return{
        props: {
          appointment: res.appoint
        }, // will be passed to the page component as props
      }
  }

export default Detail