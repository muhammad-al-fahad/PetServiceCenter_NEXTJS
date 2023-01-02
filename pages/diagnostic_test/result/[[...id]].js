import Head from 'next/head'
import Link from 'next/link'
import {useContext, useState, useEffect} from 'react'
import { DataContext } from '../../../redux/store'
import { postData, putData, getData } from '../../../utils/fetchData'
import { useRouter } from 'next/router'

const Diagnostic_Test = () => {

    const initial = {
        operator: '',
        test_type: '',
        reason_test: '',
        disease_type: '',
        disease_reason: ''
    }

    const [result, setResult] = useState(initial)
    
    const {operator, test_type, reason_test, disease_type, disease_reason} = result

    const [submit, setSubmit] = useState(false)
    const [user, setUser] = useState('')

    const [onEdit, setOnEdit] = useState(false)
    const [infection, setInfection] = useState(false)
    const [injury, setInjury] = useState(false)
    const [fracture, setFracture] = useState(false)

    const router = useRouter()
    const {id, appoint} = router.query

    const {state, dispatch} = useContext(DataContext)
    const {operators, diagnostic_test_result, appointments, auth} = state

    useEffect(() => {
        diagnostic_test_result.map(pres => {
          if(pres.appointment === appoint) setSubmit(true)
        })
    }, [diagnostic_test_result])

    useEffect(() => {
        appointments.map(app => {
           if(app._id === appoint) setUser(app.user._id)
        })
   }, [appointments])

    useEffect(() => {
       if(id){
            setOnEdit(true)
            getData(`diagnostic_test/result/${id}`).then(res => {
                setResult(res.result)
                setInfection(res.result.infection)
                setInjury(res.result.injury)
                setFracture(res.result.fracture)
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
        operator === 'all' ||
        !user || 
        test_type === 'all' || 
        !reason_test || 
        disease_type === 'all' || 
        !disease_reason
        )
            return dispatch({type: 'NOTIFY', payload: {error: "Please fill all the fields"}})

        dispatch({type: 'NOTIFY', payload: {loading: true}})
         
        let res;
        if(onEdit){

            res = await putData(`diagnostic_test/result/${id}`, {operator, infection, injury, fracture, test_type, reason_test, disease_type, disease_reason}, auth.token)
            if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})

        }else{
            
            res = await postData('diagnostic_test/result', {operator, user, appoint, infection, injury, fracture, test_type, reason_test, disease_type, disease_reason}, auth.token)
            if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})

        }

        return dispatch({type: 'NOTIFY', payload: {success: res.msg}})
    }
    
    if(!auth.user || !appoint) return null;
    return(
        <div> 
            <Head>
                <title>
                    Create Diagnostic Test Result
                </title>
            </Head>
            <div className="d-flex" style={{marginLeft: '100px'}}>
            <Link href="#!"><button className="btn btn-dark text-light w-25 mx-4 my-4"> Result </button></Link>
            <Link href={`/prescription?appoint=${appoint}`}><button className="btn btn-primary text-light w-25 mx-4 my-4"> Prescription </button></Link>
            </div>
                <form className='row' onSubmit={Submit}>
                    <div className='form-group col-md-4 offset-md-4'>

                        <div className='form-group input-group-prepend my-4 px-0'>
                            <label htmlFor='operator' style={{fontWeight: 'bold'}}> Operator </label>
                            <select name='operator' value={operator} onChange={Handle} className="form-control text-capitalize my-2 w-100">
                                <option value='all'> All </option>
                                {
                                    operators.map(animal => (
                                        <option key={animal._id} value={animal._id}> {animal.name} </option>
                                    ))
                                }
                            </select>
                        </div>

                        <div className='form-group input-group-prepend px-0 my-4'>
                            <label htmlFor='test_type' style={{fontWeight: 'bold'}}> Test Type </label>
                            <select name='test_type' value={test_type} onChange={Handle} className="form-control text-capitalize my-2 w-100">
                                <option value='all'> All </option>
                                <option value='average'> Average </option>
                            </select>
                        </div>

                        <div className='form-group input-group-prepend row my-4'>
                            <label htmlFor='reason_test' style={{fontWeight: 'bold'}}> Reason for Test </label>
                            <textarea rows={4} cols={30} name='reason_test' id='reason_test' value={reason_test} className="form-control d-block p-2 my-2" onChange={Handle}/>
                        </div>

                        <div className='custom-control custom-checkbox px-0 my-4 d-flex'>
                            <input type="checkbox" id="infection" checked={infection} className='custom-control-input' style={{width: '20px', height: '25px', marginLeft: '10px', marginTop: '-2px'}} onChange={() => setInfection(!infection)}/>
                            <label htmlFor='infection' className='custom-control-label' style={{fontWeight: 'bold', marginLeft: '10px'}}> Infection </label>
                        </div>

                        <div className='custom-control custom-checkbox px-0 my-4 d-flex'>
                            <input type="checkbox" id="injury" checked={injury} className='custom-control-input' style={{width: '20px', height: '25px', marginLeft: '10px', marginTop: '-2px'}} onChange={() => setInjury(!injury)}/>
                            <label htmlFor='injury' className='custom-control-label' style={{fontWeight: 'bold', marginLeft: '10px'}}> Injury </label>
                        </div>

                        <div className='custom-control custom-checkbox px-0 my-4 d-flex'>
                            <input type="checkbox" id="fracture" checked={fracture} className='custom-control-input' style={{width: '20px', height: '25px', marginLeft: '10px', marginTop: '-2px'}} onChange={() => setFracture(!fracture)}/>
                            <label htmlFor='fracture' className='custom-control-label' style={{fontWeight: 'bold', marginLeft: '10px'}}> Fracture </label>
                        </div>

                        <div className='form-group input-group-prepend px-0 my-4'>
                            <label htmlFor='disease_type' style={{fontWeight: 'bold'}}> Disease Type </label>
                            <select name='disease_type' value={disease_type} onChange={Handle} className="form-control text-capitalize my-2 w-100">
                                <option value='all'> All </option>
                                <option value='average'> Average </option>
                            </select>
                        </div>

                        <div className='form-group input-group-prepend px-0 my-4'>
                            <label htmlFor='disease_reason' style={{fontWeight: 'bold'}}> Reason for Disease </label>
                            <textarea rows={4} cols={30} name='disease_reason' id='disease_reason' value={disease_reason} className="form-control d-block p-2 my-2" onChange={Handle}/>
                        </div>

                        {
                            diagnostic_test_result.map(physical => (
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
                                (diagnostic_test_result.length === 0 || !submit) && !id && <div className='d-block'>
                                <button type='submit' className='btn btn-primary mb-4 col-md-4 offset-md-4' style={{color: 'white', clear: 'right', marginRight: '500px'}}> Submit </button>
                                </div>
                            }
                    </div>
                </form>
        </div>
    )
}

export default Diagnostic_Test