import Head from 'next/head'
import Link from 'next/link'
import {useContext, useState, useEffect} from 'react'
import { DataContext } from '../../../../redux/store'
import { postData, putData, getData } from '../../../../utils/fetchData'
import { useRouter } from 'next/router'

const Physical = () => {

    const initial = {
        operator: '',
        pulse: '',
        respiration: '',
        heart: '',
        heat_rhythm: '',
        lung_sounds: '',
        ears: '',
        skin: '',
        rumen: '',
        rumen_motility: '',
        pings: '',
        grunt_test: '',
        oral_cavity: '',
        capillary_refill_time: '',
        conjunctiva: '',
        nostrils: '',
        tail: '',
        milk: ''
    }

    const [result, setResult] = useState(initial)
    const router = useRouter()
    const {
        operator,
        pulse,
        respiration,
        heart,
        heat_rhythm,
        lung_sounds,
        ears, 
        skin, 
        rumen, 
        rumen_motility, 
        pings, 
        grunt_test, 
        oral_cavity, 
        capillary_refill_time, 
        conjunctiva, 
        nostrils, 
        tail, 
        milk,
    } = result

    const [onEdit, setOnEdit] = useState(false)
    const [temperature, setTemperature] = useState([])
    const {id, appoint} = router.query

    const [submit, setSubmit] = useState(false)
    const [user, setUser] = useState('')

    const {state, dispatch} = useContext(DataContext)
    const {operators, physical_result, appointments, auth} = state

    useEffect(() => {
        physical_result.map(pres => {
          if(pres.appointment === appoint) setSubmit(true)
        })
    }, [physical_result])

    useEffect(() => {
       if(pulse && respiration && heart) setTemperature({pulse: pulse, respiration: respiration, heart: heart})
    }, [pulse, respiration, heart])

    useEffect(() => {
        appointments.map(app => {
           if(app._id === appoint) setUser(app.user._id)
        })
   }, [appointments])

    useEffect(() => {
       if(id){
            setOnEdit(true)
            getData(`checkup/physical/${id}`).then(res => {
                setResult({
                    ...res.physical,
                    pulse: res.physical.temperature[0].pulse,
                    respiration: res.physical.temperature[0].respiration,
                    heart: res.physical.temperature[0].heart
                })
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
        heat_rhythm === 'all' || 
        lung_sounds === 'all' || 
        ears === 'all' || 
        skin === 'all' || 
        rumen === 'all' || 
        rumen_motility === 'all' || 
        pings === 'all' || 
        grunt_test === 'all' ||
        oral_cavity === 'all' ||
        capillary_refill_time === 'all' ||
        conjunctiva === 'all' ||
        nostrils === 'all' ||
        tail === 'all' ||
        milk === 'all'
        )
            return dispatch({type: 'NOTIFY', payload: {error: "Please fill all the fields"}})

        dispatch({type: 'NOTIFY', payload: {loading: true}})
         
        let res;
        if(onEdit){

            res = await putData(`checkup/physical/${id}`, {operator, heat_rhythm, temperature, lung_sounds, ears, skin, rumen_motility, rumen, pings, grunt_test, oral_cavity, conjunctiva, capillary_refill_time, nostrils, tail, milk}, auth.token)
            if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})

        }else{
            
            res = await postData('checkup/physical', {appoint, operator, user, heat_rhythm, temperature, lung_sounds, ears, skin, rumen_motility, rumen, pings, grunt_test, oral_cavity, conjunctiva, capillary_refill_time, nostrils, tail, milk}, auth.token)
            if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})

        }

        return dispatch({type: 'NOTIFY', payload: {success: res.msg}})
    }
    
    if(!auth.user) return null;
    return(
        <div> 
            <Head>
                <title>
                    Create Checkup Physical Result
                </title>
            </Head>
            <div className="d-flex" style={{marginLeft: '100px'}}>
            <Link href="#!"><button className="btn btn-dark text-light w-25 mx-4 my-4"> Physical Exam </button></Link>
            <Link href={`/checkup/result/visual?appoint=${appoint}`}><button className="btn btn-primary text-light w-25 mx-4 my-4"> Visual Exam </button></Link>
            <Link href={`/prescription?appoint=${appoint}`}><button className="btn btn-primary text-light w-25 mx-4 my-4"> Prescription </button></Link>
            </div>
                <form className='row' onSubmit={Submit}>
                    <div className='form-group col-md-4 offset-md-4'>

                        <div className='form-group input-group-prepend px-0 my-4'>
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
                            <label htmlFor='heat_rhythm' style={{fontWeight: 'bold'}}> Heat Rhythm </label>
                            <select name='heat_rhythm' value={heat_rhythm} onChange={Handle} className="form-control text-capitalize my-2 w-100">
                                <option value='all'> All </option>
                                <option value='average'> Average </option>
                                <option value='thin'> Thin </option>
                                <option value='poor'> Poor </option>
                                <option value='emaciated'> Emaciated </option>
                                <option value='hide-bound'> Hide-bound </option>
                                <option value='cachectic'> Cachectic </option>
                                <option value='good'> Good </option>
                                <option value='fat'> Fat </option>
                                <option value='obese'> Obese </option>
                            </select>
                        </div>

                        <div className='form-group input-group-prepend px-0 my-4'>
                            <label htmlFor='temperature' style={{fontWeight: 'bold'}}> Temperature </label>
                            <div className="d-flex">
                            <input type='text' name='pulse' id='pulse' value={pulse} placeholder=" Enter Pulse Rate" className="form-control d-block w-25 p-2 my-2" onChange={Handle}/> Pulse/min
                            <input type='text' name='respiration' id='respiration' value={respiration} placeholder=" Enter Respiration Rate" className="form-control d-block w-25 p-2 my-2" onChange={Handle}/> Respiration/min
                            <input type='text' name='heart' id='heart' value={heart} placeholder=" Enter Heart Rate" className="form-control d-block w-25 p-2 my-2" onChange={Handle}/> Heart Rate
                            </div>
                        </div>

                        <div className='form-group input-group-prepend px-0 my-4'>
                            <label htmlFor='lung_sounds' style={{fontWeight: 'bold'}}> Lung Sounds </label>
                            <select name='lung_sounds' value={lung_sounds} onChange={Handle} className="form-control text-capitalize my-2 w-100">
                                <option value='all'> All </option>
                                <option value='normal'> Normal </option>
                                <option value='depressed'> Depressed </option>
                                <option value='apathic'> Apathic </option>
                                <option value='somnolence'> Somnolence </option>
                                <option value='dummy'> Dummy </option>
                                <option value='comatose'> Comatose </option>
                                <option value='stupor'> Stupor </option>
                                <option value='fat'> Restless </option>
                                <option value='hyperesthetic'> Hyperesthetic </option>
                                <option value='maniac'> Maniac </option>
                                <option value='frenzy'> Frenzy </option>
                                <option value='convulsion'> Convulsion </option>
                                <option value='butting'> Butting </option>
                                <option value='constant'> Constant </option>
                            </select>
                        </div>

                        <div className='form-group input-group-prepend px-0 my-4'>
                            <label htmlFor='ears' style={{fontWeight: 'bold'}}> Ears </label>
                            <select name='ears' value={ears} onChange={Handle} className="form-control text-capitalize my-2 w-100">
                                <option value='all'> All </option>
                                <option value='average'> Normal </option>
                                <option value='thin'> Arched back </option>
                                <option value='poor'> Abducation </option>
                                <option value='emaciated'> Gaunt </option>
                                <option value='hide-bound'> Shifting weight </option>
                                <option value='cachectic'> Recumbent </option>
                                <option value='good'> Frequent sitting and standing </option>
                                <option value='fat'> Rolling </option>
                                <option value='obese'> Flank watching </option>
                                <option value='obese'> Forelimb crossing </option>
                            </select>
                        </div>

                        <div className='form-group input-group-prepend px-0 my-4'>
                            <label htmlFor='skin' style={{fontWeight: 'bold'}}> Skin </label>
                            <select name='skin' value={skin} onChange={Handle} className="form-control text-capitalize my-2 w-100">
                                <option value='all'> All </option>
                                <option value='average'> Average </option>
                                <option value='thin'> Thin </option>
                                <option value='poor'> Poor </option>
                                <option value='emaciated'> Emaciated </option>
                                <option value='hide-bound'> Hide-bound </option>
                                <option value='cachectic'> Cachectic </option>
                                <option value='good'> Good </option>
                                <option value='fat'> Fat </option>
                                <option value='obese'> Obese </option>
                            </select>
                        </div>

                        <div className='form-group input-group-prepend px-0 my-4'>
                            <label htmlFor='rumen' style={{fontWeight: 'bold'}}> Rumen </label>
                            <select name='rumen' value={rumen} onChange={Handle} className="form-control text-capitalize my-2 w-100">
                                <option value='all'> All </option>
                                <option value='average'> Average </option>
                                <option value='thin'> Thin </option>
                                <option value='poor'> Poor </option>
                                <option value='emaciated'> Emaciated </option>
                                <option value='hide-bound'> Hide-bound </option>
                                <option value='cachectic'> Cachectic </option>
                                <option value='good'> Good </option>
                                <option value='fat'> Fat </option>
                                <option value='obese'> Obese </option>
                            </select>
                        </div>

                        <div className='form-group input-group-prepend px-0 my-4'>
                            <label htmlFor='rumen_motility' style={{fontWeight: 'bold'}}> Rumen Motility </label>
                            <select name='rumen_motility' value={rumen_motility} onChange={Handle} className="form-control text-capitalize my-2 w-100">
                                <option value='all'> All </option>
                                <option value='average'> Average </option>
                                <option value='thin'> Thin </option>
                                <option value='poor'> Poor </option>
                                <option value='emaciated'> Emaciated </option>
                                <option value='hide-bound'> Hide-bound </option>
                                <option value='cachectic'> Cachectic </option>
                                <option value='good'> Good </option>
                                <option value='fat'> Fat </option>
                                <option value='obese'> Obese </option>
                            </select>
                        </div>

                        <div className='form-group input-group-prepend px-0 my-4'>
                            <label htmlFor='pings' style={{fontWeight: 'bold'}}> Pings </label>
                            <select name='pings' value={pings} onChange={Handle} className="form-control text-capitalize my-2 w-100">
                                <option value='all'> All </option>
                                <option value='average'> Average </option>
                                <option value='thin'> Thin </option>
                                <option value='poor'> Poor </option>
                                <option value='emaciated'> Emaciated </option>
                                <option value='hide-bound'> Hide-bound </option>
                                <option value='cachectic'> Cachectic </option>
                                <option value='good'> Good </option>
                                <option value='fat'> Fat </option>
                                <option value='obese'> Obese </option>
                            </select>
                        </div>

                        <div className='form-group input-group-prepend px-0 my-4'>
                            <label htmlFor='grunt_test' style={{fontWeight: 'bold'}}> Grunt Test </label>
                            <select name='grunt_test' value={grunt_test} onChange={Handle} className="form-control text-capitalize my-2 w-100">
                                <option value='all'> All </option>
                                <option value='average'> Average </option>
                                <option value='thin'> Thin </option>
                                <option value='poor'> Poor </option>
                                <option value='emaciated'> Emaciated </option>
                                <option value='hide-bound'> Hide-bound </option>
                                <option value='cachectic'> Cachectic </option>
                                <option value='good'> Good </option>
                                <option value='fat'> Fat </option>
                                <option value='obese'> Obese </option>
                            </select>
                        </div>

                        <div className='form-group input-group-prepend px-0 my-4'>
                            <label htmlFor='oral_cavity' style={{fontWeight: 'bold'}}> Oral Cavity </label>
                            <select name='oral_cavity' value={oral_cavity} onChange={Handle} className="form-control text-capitalize my-2 w-100">
                                <option value='all'> All </option>
                                <option value='average'> Average </option>
                                <option value='thin'> Thin </option>
                                <option value='poor'> Poor </option>
                                <option value='emaciated'> Emaciated </option>
                                <option value='hide-bound'> Hide-bound </option>
                                <option value='cachectic'> Cachectic </option>
                                <option value='good'> Good </option>
                                <option value='fat'> Fat </option>
                                <option value='obese'> Obese </option>
                            </select>
                        </div>

                        <div className='form-group input-group-prepend px-0 my-4'>
                            <label htmlFor='capillary_refill_time' style={{fontWeight: 'bold'}}> Capillary Refill Time </label>
                            <select name='capillary_refill_time' value={capillary_refill_time} onChange={Handle} className="form-control text-capitalize my-2 w-100">
                                <option value='all'> All </option>
                                <option value='average'> Average </option>
                                <option value='thin'> Thin </option>
                                <option value='poor'> Poor </option>
                                <option value='emaciated'> Emaciated </option>
                                <option value='hide-bound'> Hide-bound </option>
                                <option value='cachectic'> Cachectic </option>
                                <option value='good'> Good </option>
                                <option value='fat'> Fat </option>
                                <option value='obese'> Obese </option>
                            </select>
                        </div>

                        <div className='form-group input-group-prepend px-0 my-4'>
                            <label htmlFor='conjunctiva' style={{fontWeight: 'bold'}}> Conjunctiva </label>
                            <select name='conjunctiva' value={conjunctiva} onChange={Handle} className="form-control text-capitalize my-2 w-100">
                                <option value='all'> All </option>
                                <option value='average'> Average </option>
                                <option value='thin'> Thin </option>
                                <option value='poor'> Poor </option>
                                <option value='emaciated'> Emaciated </option>
                                <option value='hide-bound'> Hide-bound </option>
                                <option value='cachectic'> Cachectic </option>
                                <option value='good'> Good </option>
                                <option value='fat'> Fat </option>
                                <option value='obese'> Obese </option>
                            </select>
                        </div>

                        <div className='form-group input-group-prepend px-0 my-4'>
                            <label htmlFor='nostrils' style={{fontWeight: 'bold'}}> Nostrils </label>
                            <select name='nostrils' value={nostrils} onChange={Handle} className="form-control text-capitalize my-2 w-100">
                                <option value='all'> All </option>
                                <option value='average'> Average </option>
                                <option value='thin'> Thin </option>
                                <option value='poor'> Poor </option>
                                <option value='emaciated'> Emaciated </option>
                                <option value='hide-bound'> Hide-bound </option>
                                <option value='cachectic'> Cachectic </option>
                                <option value='good'> Good </option>
                                <option value='fat'> Fat </option>
                                <option value='obese'> Obese </option>
                            </select>
                        </div>

                        <div className='form-group input-group-prepend px-0 my-4'>
                            <label htmlFor='tail' style={{fontWeight: 'bold'}}> Tail </label>
                            <select name='tail' value={tail} onChange={Handle} className="form-control text-capitalize my-2 w-100">
                                <option value='all'> All </option>
                                <option value='average'> Average </option>
                                <option value='thin'> Thin </option>
                                <option value='poor'> Poor </option>
                                <option value='emaciated'> Emaciated </option>
                                <option value='hide-bound'> Hide-bound </option>
                                <option value='cachectic'> Cachectic </option>
                                <option value='good'> Good </option>
                                <option value='fat'> Fat </option>
                                <option value='obese'> Obese </option>
                            </select>
                        </div>

                        <div className='form-group input-group-prepend px-0 my-4'>
                            <label htmlFor='milk' style={{fontWeight: 'bold'}}> Milk </label>
                            <select name='milk' value={milk} onChange={Handle} className="form-control text-capitalize my-2 w-100">
                                <option value='all'> All </option>
                                <option value='average'> Average </option>
                                <option value='thin'> Thin </option>
                                <option value='poor'> Poor </option>
                                <option value='emaciated'> Emaciated </option>
                                <option value='hide-bound'> Hide-bound </option>
                                <option value='cachectic'> Cachectic </option>
                                <option value='good'> Good </option>
                                <option value='fat'> Fat </option>
                                <option value='obese'> Obese </option>
                            </select>
                        </div>
                        {
                            physical_result.map(physical => (
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
                                (physical_result.length === 0 || !submit) && !id && <div className='d-block'>
                                <button type='submit' className='btn btn-primary mb-4 col-md-4 offset-md-4' style={{color: 'white', clear: 'right', marginRight: '500px'}}> Submit </button>
                                </div>
                            }
                    </div>
                </form>
        </div>
    )
}

export default Physical