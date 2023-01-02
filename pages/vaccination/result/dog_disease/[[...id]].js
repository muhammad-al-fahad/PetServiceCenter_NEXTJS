import Head from 'next/head'
import Link from 'next/link'
import {useContext, useState, useEffect} from 'react'
import { DataContext } from '../../../../redux/store'
import { postData, putData, getData } from '../../../../utils/fetchData'
import { useRouter } from 'next/router'

const Vaccination = () => {

    const initial = {
        operator: '',
        rabbies: '',
        distemper: '',
        bordetella: '',
        lyme: '',
        parvo: '',
        leptospiroses: '',
        hepatitis: '',
        parainfluenza: '',
        age_per_week: 0,
        vaccine: '',
        type_vaccine: '',
        core_vaccine: '',
        non_core_vaccine: '',
        condition: ''
    }

    const [result, setResult] = useState(initial)
    const router = useRouter()
    const {operator, rabbies, distemper, bordetella, lyme, parvo, leptospiroses, hepatitis, parainfluenza, age_per_week, vaccine, type_vaccine, core_vaccine, non_core_vaccine, condition} = result

    const [submit, setSubmit] = useState(false)
    const [user, setUser] = useState('')
    
    const [onEdit, setOnEdit] = useState(false)
    const [category, setCategory] = useState('')
    const [pet, setPet] = useState('')

    const {id, appoint } = router.query

    const {state, dispatch} = useContext(DataContext)
    const {operators, dog_disease, appointments, petCategories, auth} = state

    useEffect(() => {
        dog_disease.map(pres => {
          if(pres.appointment === appoint) setSubmit(true)
        })
    }, [dog_disease])

    useEffect(() => {
        appointments.map(app => {
            if(app._id === appoint){ 
                setCategory(app.petData[0].petCategory)
                setUser(app.user._id) 
            }   
        })
     }, [appointments])

     useEffect(() => {
        petCategories.map(app => {
            if(app._id === category) setPet(app.name)
        })
     }, [category])

    useEffect(() => {
       if(id){
            setOnEdit(true)
            getData(`vaccination/dog_disease/${id}`).then(res => {
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
        operator === 'all' ||
        !user ||
        !condition || 
        rabbies === 'all' || 
        distemper === 'all' || 
        bordetella === 'all' || 
        lyme === 'all' ||
        parvo === 'all' || 
        leptospiroses === 'all' ||
        hepatitis === 'all' || 
        parainfluenza === 'all' || 
        age_per_week === 0 || 
        vaccine === 'all' ||  
        type_vaccine === 'all' ||
        core_vaccine === 'all' ||
        non_core_vaccine === 'all'
        )
            return dispatch({type: 'NOTIFY', payload: {error: "Please fill all the fields"}})

        dispatch({type: 'NOTIFY', payload: {loading: true}})
         
        let res;
        if(onEdit){

            res = await putData(`vaccination/dog_disease/${id}`, {operator, rabbies, distemper, bordetella, lyme, parvo, leptospiroses, hepatitis, parainfluenza, age_per_week, vaccine, type_vaccine, core_vaccine, non_core_vaccine, condition}, auth.token)
            if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})

        }else{
            
            res = await postData('vaccination/dog_disease', {appoint, operator, user, rabbies, distemper, bordetella, lyme, parvo, leptospiroses, hepatitis, parainfluenza, age_per_week, vaccine, type_vaccine, core_vaccine, non_core_vaccine, condition}, auth.token)
            if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})

        }

        return dispatch({type: 'NOTIFY', payload: {success: res.msg}})
    }
    
    if(!auth.user || !appoint || pet === "Cat") return null;
    return(
        <div> 
            <Head>
                <title>
                    Create Dog Disease Vaccination Result
                </title>
            </Head>
            <div className="d-flex" style={{marginLeft: '100px'}}>
            <Link href="#!"><button className="btn btn-dark text-light w-25 mx-4 my-4"> Dog Disease </button></Link>
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
                            <label htmlFor='condition' style={{fontWeight: 'bold'}}> Condition </label>
                            <textarea rows={4} cols={30} name='condition' id='condition' value={condition} className="form-control d-block p-2 my-2" onChange={Handle}/>
                        </div>

                        <div className='form-group input-group-prepend px-0 my-4'>
                            <label htmlFor='rabbies' style={{fontWeight: 'bold'}}> Rabbies </label>
                            <select name='rabbies' value={rabbies} onChange={Handle} className="form-control text-capitalize my-2 w-100">
                                <option value='all'> All </option>
                                <option value='average'> Average </option>
                            </select>
                        </div>

                        <div className='form-group input-group-prepend px-0 my-4'>
                            <label htmlFor='distemper' style={{fontWeight: 'bold'}}> Distemper </label>
                            <select name='distemper' value={distemper} onChange={Handle} className="form-control text-capitalize my-2 w-100">
                                <option value='all'> All </option>
                                <option value='average'> Average </option>
                            </select>
                        </div>

                        <div className='form-group input-group-prepend px-0 my-4'>
                            <label htmlFor='bordetella' style={{fontWeight: 'bold'}}> Bordetella </label>
                            <select name='bordetella' value={bordetella} onChange={Handle} className="form-control text-capitalize my-2 w-100">
                                <option value='all'> All </option>
                                <option value='average'> Average </option>
                            </select>
                        </div>

                        <div className='form-group input-group-prepend px-0 my-4'>
                            <label htmlFor='lyme' style={{fontWeight: 'bold'}}> Lyme </label>
                            <select name='lyme' value={lyme} onChange={Handle} className="form-control text-capitalize my-2 w-100">
                                <option value='all'> All </option>
                                <option value='average'> Average </option>
                            </select>
                        </div>

                        <div className='form-group input-group-prepend px-0 my-4'>
                            <label htmlFor='parvo' style={{fontWeight: 'bold'}}> Parvo </label>
                            <select name='parvo' value={parvo} onChange={Handle} className="form-control text-capitalize my-2 w-100">
                                <option value='all'> All </option>
                                <option value='average'> Average </option>
                            </select>
                        </div>

                        <div className='form-group input-group-prepend px-0 my-4'>
                            <label htmlFor='leptospiroses' style={{fontWeight: 'bold'}}> Leptospiroses </label>
                            <select name='leptospiroses' value={leptospiroses} onChange={Handle} className="form-control text-capitalize my-2 w-100">
                                <option value='all'> All </option>
                                <option value='average'> Average </option>
                            </select>
                        </div>

                        <div className='form-group input-group-prepend px-0 my-4'>
                            <label htmlFor='hepatitis' style={{fontWeight: 'bold'}}> Hepatitis </label>
                            <select name='hepatitis' value={hepatitis} onChange={Handle} className="form-control text-capitalize my-2 w-100">
                                <option value='all'> All </option>
                                <option value='average'> Average </option>
                            </select>
                        </div>

                        <div className='form-group input-group-prepend px-0 my-4'>
                            <label htmlFor='parainfluenza' style={{fontWeight: 'bold'}}> Parainfluenza </label>
                            <select name='parainfluenza' value={parainfluenza} onChange={Handle} className="form-control text-capitalize my-2 w-100">
                                <option value='all'> All </option>
                                <option value='average'> Average </option>
                            </select>
                        </div>

                        <div className='form-group input-group-prepend px-0 my-4'>
                            <label htmlFor='age_per_week' style={{fontWeight: 'bold'}}> Age </label>
                            <div className="d-flex"><input type="number" name='age_per_week' id='age_per_week' value={age_per_week} className="form-control d-block p-2 my-2 w-50" onChange={Handle}/> <p style={{fontWeight: 'bold', marginLeft: "20px", marginTop: "15px"}}>Weeks</p> </div>
                        </div>

                        <div className='form-group input-group-prepend px-0 my-4'>
                            <label htmlFor='vaccine' style={{fontWeight: 'bold'}}> Vaccine </label>
                            <select name='vaccine' value={vaccine} onChange={Handle} className="form-control text-capitalize my-2 w-100">
                                <option value='all'> All </option>
                                <option value='average'> Average </option>
                            </select>
                        </div>

                        <div className='form-group input-group-prepend px-0 my-4'>
                            <label htmlFor='type_vaccine' style={{fontWeight: 'bold'}}> Vaccine Type </label>
                            <select name='type_vaccine' value={type_vaccine} onChange={Handle} className="form-control text-capitalize my-2 w-100">
                                <option value='all'> All </option>
                                <option value='average'> Average </option>
                            </select>
                        </div>

                        <div className='form-group input-group-prepend px-0 my-4'>
                            <label htmlFor='core_vaccine' style={{fontWeight: 'bold'}}> Core Vaccine </label>
                            <select name='core_vaccine' value={core_vaccine} onChange={Handle} className="form-control text-capitalize my-2 w-100">
                                <option value='all'> All </option>
                                <option value='average'> Average </option>
                            </select>
                        </div>

                        <div className='form-group input-group-prepend px-0 my-4'>
                            <label htmlFor='non_core_vaccine' style={{fontWeight: 'bold'}}> Non Core Vaccine</label>
                            <select name='non_core_vaccine' value={non_core_vaccine} onChange={Handle} className="form-control text-capitalize my-2 w-100">
                                <option value='all'> All </option>
                                <option value='average'> Average </option>
                            </select>
                        </div>

                        {
                            dog_disease.map(physical => (
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
                                (dog_disease.length === 0 || !submit) && !id && <div className='d-block'>
                                <button type='submit' className='btn btn-primary mb-4 col-md-4 offset-md-4' style={{color: 'white', clear: 'right', marginRight: '500px'}}> Submit </button>
                                </div>
                            }
                    </div>
                </form>
        </div>
    )
}

export default Vaccination