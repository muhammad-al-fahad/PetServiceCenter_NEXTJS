import Head from 'next/head'
import Link from 'next/link'
import {useContext, useState, useEffect} from 'react'
import { DataContext } from '../../../redux/store'
import { postData, putData, getData } from '../../../utils/fetchData'
import { useRouter } from 'next/router'

const Treatment = () => {

    const initial = {
        operator: '',
        general_apperance: '',
        physical: '',
        eyes: '',
        ears: '',
        respiratory: '',
        oral_exam: '',
        lymph_nodes: '',
        cardiovasscular: '',
        abdomen: '',
        genitourinary: '',
        skin: '',
        mussculos_keletal: '',
        neurological: '',
        test: '',
        treatment_plan: ''
    }

    const [result, setResult] = useState(initial)
    const router = useRouter()
    const {operator, general_apperance, physical, eyes, ears, respiratory, oral_exam, lymph_nodes, cardiovasscular, abdomen, genitourinary, skin, mussculos_keletal, neurological, test, treatment_plan} = result

    const [submit, setSubmit] = useState(false)
    const [user, setUser] = useState('')

    const [onEdit, setOnEdit] = useState(false)
    const [other_exam_finding, setOther_exam_finding] = useState([])
    const [fever, setFever] = useState(false)
    const [digest, setDigest] = useState(false)
    const [lethargy, setLethargy] = useState(false)
    const [diet, setDiet] = useState(false)

    const {id, appoint} = router.query

    const {state, dispatch} = useContext(DataContext)
    const {operators, physical_result, appointments, treatment_result, auth} = state

    useEffect(() => {
        treatment_result.map(pres => {
          if(pres.appointment === appoint) setSubmit(true)
        })
    }, [treatment_result])

    useEffect(() => {
        appointments.map(app => {
           if(app._id === appoint) setUser(app.user._id)
        })
   }, [appointments])

    useEffect(() => {
        setOther_exam_finding({fever: fever, digest: digest, lethargy: lethargy, diet: diet})
    }, [diet, fever, lethargy, digest])

    useEffect(() => {
       if(id){
            setOnEdit(true)
            getData(`treatment/result/${id}`).then(res => {
                setResult(res.result)
                setFever(res.result.other_exam_finding[0].fever)
                setDigest(res.result.other_exam_finding[0].digest)
                setLethargy(res.result.other_exam_finding[0].lethargy)
                setDiet(res.result.other_exam_finding[0].diet)
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
        !general_apperance || 
        physical === 'all' || 
        ears === 'all' || 
        skin === 'all' || 
        eyes === 'all' || 
        respiratory === 'all' || 
        !oral_exam ||
        lymph_nodes === 'all' ||  
        cardiovasscular === 'all' ||
        abdomen === 'all' ||
        genitourinary === 'all' ||
        mussculos_keletal === 'all' ||
        neurological === 'all' ||
        !test ||
        !treatment_plan
        )
            return dispatch({type: 'NOTIFY', payload: {error: "Please fill all the fields"}})

        dispatch({type: 'NOTIFY', payload: {loading: true}})
         
        let res;
        if(onEdit){

            res = await putData(`treatment/result/${id}`, {operator, other_exam_finding, general_apperance, physical, eyes, ears, respiratory, oral_exam, lymph_nodes, cardiovasscular, abdomen, genitourinary, skin, mussculos_keletal, neurological, test, treatment_plan}, auth.token)
            if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})

        }else{
            
            res = await postData('treatment/result', {appoint, operator, user, other_exam_finding, general_apperance, physical, eyes, ears, respiratory, oral_exam, lymph_nodes, cardiovasscular, abdomen, genitourinary, skin, mussculos_keletal, neurological, test, treatment_plan}, auth.token)
            if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})

        }

        return dispatch({type: 'NOTIFY', payload: {success: res.msg}})
    }
    
    if(!auth.user) return null;
    return(
        <div> 
            <Head>
                <title>
                    Create Treatment Result
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

                        <div className='form-group input-group-prepend my-4 px-0'>
                            <label htmlFor='physical' style={{fontWeight: 'bold'}}> Physical Examination </label>
                            <select name='physical' value={physical} onChange={Handle} className="form-control text-capitalize my-2 w-100">
                                <option value='all'> All </option>
                                {
                                    physical_result.map(animal => (
                                        <option key={animal._id} value={animal._id}> {animal._id} </option>
                                    ))
                                }
                            </select>
                        </div>

                        <div className='form-group input-group-prepend px-0 my-4'>
                            <label htmlFor='general_apperance' style={{fontWeight: 'bold'}}> General Appearance </label>
                            <textarea rows={4} cols={30} name='general_apperance' id='general_apperance' value={general_apperance} className="form-control d-block p-2 my-2" onChange={Handle}/>
                        </div>

                        <h5 style={{fontWeight: 'bold'}}> Other Exam Finding </h5>
                        <div className='custom-control custom-checkbox px-0 my-2 d-flex'>
                            <input type="checkbox" className='custom-control-input' style={{width: '20px', height: '25px', marginLeft: '10px', marginTop: '-2px'}} checked={fever} onChange={() => setFever(!fever)}/>
                            <label htmlFor='fever' className='custom-control-label' style={{fontWeight: 'bold', marginLeft: '10px'}}> Fever </label>
                        </div>
                        <div className='custom-control custom-checkbox px-0 my-2 d-flex'>
                            <input type="checkbox" className='custom-control-input' style={{width: '20px', height: '25px', marginLeft: '10px', marginTop: '-2px'}} checked={digest} onChange={() => setDigest(!digest)}/>
                            <label htmlFor='digest' className='custom-control-label' style={{fontWeight: 'bold', marginLeft: '10px'}}>  Indigestion and Loosemotion </label>
                        </div>
                        <div className='custom-control custom-checkbox px-0 my-2 d-flex'>
                            <input type="checkbox" className='custom-control-input' style={{width: '20px', height: '25px', marginLeft: '10px', marginTop: '-2px'}} checked={lethargy} onChange={() => setLethargy(!lethargy)}/>
                            <label htmlFor='lethargy' className='custom-control-label' style={{fontWeight: 'bold', marginLeft: '10px'}}> Lethargy </label>
                        </div>
                        <div className='custom-control custom-checkbox px-0 my-2 d-flex'>
                            <input type="checkbox" className='custom-control-input' style={{width: '20px', height: '25px', marginLeft: '10px', marginTop: '-2px'}} checked={diet} onChange={() => setDiet(!diet)}/>
                            <label htmlFor='diet' className='custom-control-label' style={{fontWeight: 'bold', marginLeft: '10px'}}> Diet Issues </label>
                        </div>

                        <div className='form-group input-group-prepend px-0 my-4'>
                            <label htmlFor='eyes' style={{fontWeight: 'bold'}}> Eyes </label>
                            <select name='eyes' value={eyes} onChange={Handle} className="form-control text-capitalize my-2 w-100">
                                <option value='all'> All </option>
                                <option value='average'> Average </option>
                            </select>
                        </div>

                        <div className='form-group input-group-prepend px-0 my-4'>
                            <label htmlFor='ears' style={{fontWeight: 'bold'}}> Ears </label>
                            <select name='ears' value={ears} onChange={Handle} className="form-control text-capitalize my-2 w-100">
                                <option value='all'> All </option>
                                <option value='average'> Average </option>
                            </select>
                        </div>

                        <div className='form-group input-group-prepend px-0 my-4'>
                            <label htmlFor='skin' style={{fontWeight: 'bold'}}> Skin </label>
                            <select name='skin' value={skin} onChange={Handle} className="form-control text-capitalize my-2 w-100">
                                <option value='all'> All </option>
                                <option value='average'> Average </option>
                            </select>
                        </div>

                        <div className='form-group input-group-prepend px-0 my-4'>
                            <label htmlFor='respiratory' style={{fontWeight: 'bold'}}> Respiratory </label>
                            <select name='respiratory' value={respiratory} onChange={Handle} className="form-control text-capitalize my-2 w-100">
                                <option value='all'> All </option>
                                <option value='average'> Average </option>
                            </select>
                        </div>

                        <div className='form-group input-group-prepend px-0 my-4'>
                            <label htmlFor='lymph_nodes' style={{fontWeight: 'bold'}}> Lymph Nodes </label>
                            <select name='lymph_nodes' value={lymph_nodes} onChange={Handle} className="form-control text-capitalize my-2 w-100">
                                <option value='all'> All </option>
                                <option value='average'> Average </option>
                            </select>
                        </div>

                        <div className='form-group input-group-prepend px-0 my-4'>
                            <label htmlFor='cardiovasscular' style={{fontWeight: 'bold'}}> Cardiovasscular </label>
                            <select name='cardiovasscular' value={cardiovasscular} onChange={Handle} className="form-control text-capitalize my-2 w-100">
                                <option value='all'> All </option>
                                <option value='average'> Average </option>
                            </select>
                        </div>

                        <div className='form-group input-group-prepend px-0 my-4'>
                            <label htmlFor='abdomen' style={{fontWeight: 'bold'}}> Abdomen </label>
                            <select name='abdomen' value={abdomen} onChange={Handle} className="form-control text-capitalize my-2 w-100">
                                <option value='all'> All </option>
                                <option value='average'> Average </option>
                            </select>
                        </div>

                        <div className='form-group input-group-prepend px-0 my-4'>
                            <label htmlFor='genitourinary' style={{fontWeight: 'bold'}}> Genitourinary </label>
                            <select name='genitourinary' value={genitourinary} onChange={Handle} className="form-control text-capitalize my-2 w-100">
                                <option value='all'> All </option>
                                <option value='average'> Average </option>
                            </select>
                        </div>

                        <div className='form-group input-group-prepend px-0 my-4'>
                            <label htmlFor='mussculos_keletal' style={{fontWeight: 'bold'}}> Mussculos Keletal </label>
                            <select name='mussculos_keletal' value={mussculos_keletal} onChange={Handle} className="form-control text-capitalize my-2 w-100">
                                <option value='all'> All </option>
                                <option value='average'> Average </option>
                            </select>
                        </div>

                        <div className='form-group input-group-prepend px-0 my-4'>
                            <label htmlFor='neurological' style={{fontWeight: 'bold'}}> Neurological </label>
                            <select name='neurological' value={neurological} onChange={Handle} className="form-control text-capitalize my-2 w-100">
                                <option value='all'> All </option>
                                <option value='average'> Average </option>
                            </select>
                        </div>

                        <div className='form-group input-group-prepend px-0 my-4'>
                            <label htmlFor='oral_exam' style={{fontWeight: 'bold'}}> Oral Exam </label>
                            <textarea rows={4} cols={30} name='oral_exam' id='oral_exam' value={oral_exam} className="form-control d-block p-2 my-2" onChange={Handle}/>
                        </div>

                        <div className='form-group input-group-prepend px-0 my-4'>
                            <label htmlFor='test' style={{fontWeight: 'bold'}}> Examination </label>
                            <textarea rows={4} cols={30} name='test' id='test' value={test} className="form-control d-block p-2 my-2" onChange={Handle}/>
                        </div>

                        <div className='form-group input-group-prepend px-0 my-4'>
                            <label htmlFor='treatment_plan' style={{fontWeight: 'bold'}}> Treatment Plan </label>
                            <textarea rows={4} cols={30} name='treatment_plan' id='treatment_plan' value={treatment_plan} className="form-control d-block p-2 my-2" onChange={Handle}/>
                        </div>

                        {
                            treatment_result.map(physical => (
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
                                (treatment_result.length === 0 || !submit) && !id && <div className='d-block'>
                                <button type='submit' className='btn btn-primary mb-4 col-md-4 offset-md-4' style={{color: 'white', clear: 'right', marginRight: '500px'}}> Submit </button>
                                </div>
                            }

                    </div>
                </form>
        </div>
    )
}

export default Treatment