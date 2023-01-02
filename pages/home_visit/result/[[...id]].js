import Head from 'next/head'
import Link from 'next/link'
import {useContext, useState, useEffect} from 'react'
import { DataContext } from '../../../redux/store'
import { postData, putData, getData } from '../../../utils/fetchData'
import { useRouter } from 'next/router'

const Home_Visit = () => {

    const initial = {
        service: '',
        guidence: '',
    }

    const [result, setResult] = useState(initial)
    
    const {service, guidence} = result

    const [onEdit, setOnEdit] = useState(false)
    const [user, setUser] = useState('')

    const router = useRouter()
    const {id, appoint} = router.query

    const [submit, setSubmit] = useState(false)

    const {state, dispatch} = useContext(DataContext)
    const {home_visit_result, appointments, auth} = state

    useEffect(() => {
        home_visit_result.map(pres => {
          if(pres.appointment === appoint) setSubmit(true)
        })
    }, [home_visit_result])

    useEffect(() => {
         appointments.map(app => {
            if(app._id === appoint) setUser(app.user._id)
         })
    }, [appointments])

    useEffect(() => {
       if(id){
            setOnEdit(true)
            getData(`home_visit/result/${id}`).then(res => {
                setResult(res.result)
            })
       }else{
            setOnEdit(false)
            setResult(initial)
       }
    }, [id])

    const Handle = (props) => {
       const {name, value} = props.target
       setResult({...result, [name]: value})
       dispatch({type: 'NOTIFY', payload: {}})
    }

    const Submit = async (props) => {
        props.preventDefault()

        if(
        !user ||
        service === 'all' || 
        !guidence
        )
            return dispatch({type: 'NOTIFY', payload: {error: "Please fill all the fields"}})

        dispatch({type: 'NOTIFY', payload: {loading: true}})
         
        let res;
        if(onEdit){

            res = await putData(`home_visit/result/${id}`, {service, guidence}, auth.token)
            if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})

        }else{
            
            res = await postData('home_visit/result', {user, appoint, service, guidence}, auth.token)
            if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})

        }

        return dispatch({type: 'NOTIFY', payload: {success: res.msg}})
    }
    
    if(!auth.user || !appoint) return null;
    return(
        <div> 
            <Head>
                <title>
                    Create Home Visit Result
                </title>
            </Head>
            <div className="d-flex" style={{marginLeft: '100px'}}>
            <Link href="#!"><button className="btn btn-dark text-light w-25 mx-4 my-4"> Result </button></Link>
            <Link href={`/prescription?appoint=${appoint}`}><button className="btn btn-primary text-light w-25 mx-4 my-4"> Prescription </button></Link>
            </div>
                <form className='row' onSubmit={Submit}>
                    <div className='form-group col-md-4 offset-md-4'>

                        <div className='form-group input-group-prepend px-0 my-4'>
                            <label htmlFor='service' style={{fontWeight: 'bold'}}> Service </label>
                            <select name='service' value={service} onChange={Handle} className="form-control text-capitalize my-2 w-100">
                                <option value='all'> All </option>
                                <option value='average'> Checkup </option>
                                <option value='average'> Treatment </option>
                                <option value='average'> Vaccination </option>
                                <option value='average'> Diagnostic Test </option>
                            </select>
                        </div>

                        <div className='form-group input-group-prepend row my-4'>
                            <label htmlFor='guidence' style={{fontWeight: 'bold'}}> Guidence </label>
                            <textarea rows={4} cols={30} name='guidence' id='guidence' value={guidence} className="form-control d-block p-2 my-2" onChange={Handle}/>
                        </div>

                        {
                            home_visit_result.map(physical => (
                                !id && physical.appointment === appoint && <div key={physical._id} className='d-block'>
                                <button type='submit' className='btn btn-primary mb-4 col-md-4 offset-md-4' style={{color: 'white', clear: 'right', marginRight: '500px'}} disabled="true"> Submit </button>
                                <em style={{color: 'crimson', marginLeft: '425px'}}>* You Dont Allow to Create More Than one Result of Specific Appointment *</em>
                                </div>
                            ))
                            }
                            {
                                id && <div className='d-block'>
                                    <button type='submit' className='btn btn-primary mb-4 col-md-4 offset-md-4' style={{color: 'white', clear: 'right', marginRight: '500px'}}> Update </button>
                                </div>
                            }
                            {
                                (home_visit_result.length === 0 || !submit) && !id && <div className='d-block'>
                                <button type='submit' className='btn btn-primary mb-4 col-md-4 offset-md-4' style={{color: 'white', clear: 'right', marginRight: '500px'}}> Submit </button>
                                </div>
                            }
                    </div>
                </form>
        </div>
    )
}

export default Home_Visit