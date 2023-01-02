import Head from 'next/head'
import Link from 'next/link'
import {useContext, useState, useEffect} from 'react'
import { DataContext } from '../../redux/store'
import { postData, putData, getData, } from '../../utils/fetchData'
import { updateItem } from '../../redux/action'
import { useRouter } from 'next/router'

const Prescription = () => {
    const initial = {
        operator: '',
        no_of_repeat_prescription: 0,
        interval_between_repeat: 0,
        furthur_information: '',
        quantity_in_each_repeat: 0,
        prescription_expiry_date: '',
        total_quantity_to_disease: 0
    }

    const [result, setResult] = useState(initial)
    const [product, setProduct] = useState([])
    const [onEdit, setOnEdit] = useState(false)
    const router = useRouter()
    const {id, appoint} = router.query

    const {
        operator,
        no_of_repeat_prescription,
        interval_between_repeat,
        furthur_information,
        quantity_in_each_repeat,
        prescription_expiry_date,
        total_quantity_to_disease
    } = result

    const [service, setService] = useState('')
    const [category, setCategory] = useState('')
    const [pet, setPet] = useState('')

    const [submit, setSubmit] = useState(false)
    const [user, setUser] = useState('')

    const [Id, setId] = useState('')
    const [proname, setProname] = useState('')
    const [prostrength, setProstrength] = useState(0)
    const [proquantity, setProquantity] = useState(0)
    const [prodose, setProdose] = useState(0)
    const [proinstruction, setProinstruction] = useState('')

    const [repeat, setRepeat] = useState(false)

    const {state, dispatch} = useContext(DataContext)
    const {medicines, operators, appointments, prescriptions, petCategories, auth} = state

    useEffect(() => {
        setProduct(medicines)
     }, [medicines])

     useEffect(() => {
         prescriptions.map(pres => {
           if(pres.appointment === appoint) setSubmit(true)
         })
     }, [prescriptions])

     useEffect(() => {
        appointments.map(app => {
            if(app._id === appoint){
                setService(app.serviceData[0].name)
                setCategory(app.petData[0].petCategory)
                setUser(app.user._id)
            }
        })
     }, [appointments])

     useEffect(() => {
        petCategories.map(app => {
            if(app._id === category) setPet(app.name)
        })
     }, [category, petCategories])

    useEffect(() => {
       if(id){
            setOnEdit(true)
            getData(`prescription/${id}`).then(res => {
                setResult(res.prescription)
                setRepeat(res.prescription.repeat_prescription)
                dispatch({type: "ADD_MEDICINE", payload: res.prescription.product})
            })
       }else{
            setOnEdit(false)
            setResult(initial)
            dispatch({type: "ADD_MEDICINE", payload: []})
       }
    }, [id])

    const Handle = (props) => {
       const {name, value} = props.target
       setResult({...result, [name]: value})
       dispatch({type: 'NOTIFY', payload: {}})
    }

    const Submit = async (props) => {
        props.preventDefault()

        dispatch({type: 'NOTIFY', payload: {loading: true}})
         
        let res;
        if(onEdit){

            res = await putData(`prescription/${id}`, {operator, product, repeat, no_of_repeat_prescription, interval_between_repeat, furthur_information, quantity_in_each_repeat, prescription_expiry_date, total_quantity_to_disease}, auth.token)
            if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})

        }else{
            
            res = await postData('prescription', {appoint, operator, user, product, repeat, no_of_repeat_prescription, interval_between_repeat, furthur_information, quantity_in_each_repeat, prescription_expiry_date, total_quantity_to_disease}, auth.token)
            if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})

        }

        return dispatch({type: 'NOTIFY', payload: {success: res.msg}})
    }

    const createCategory = async () => {

        dispatch({type: 'NOTIFY', payload: {loading: true}})

        let res;
        if(Id){

            res = await putData(`medicine/${Id}`, {proname, prostrength, proquantity, prodose, proinstruction}, auth.token)

            if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})
    
            dispatch(updateItem(medicines, Id, res.category, 'ADD_MEDICINE'))

        }else{

            res = await postData('medicine', {proname, prostrength, proquantity, prodose, proinstruction}, auth.token)

            if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})
    
            dispatch({type: 'ADD_MEDICINE', payload: [...medicines, res.newCategory]})

        }

        setId('')
        setProname('')
        setProstrength('')
        setProquantity('')
        setProdose('')
        setProinstruction('')
    
        return dispatch({type: 'NOTIFY', payload: {success: res.msg}})

    }

    const editCategory = (category) => {
        setId(category._id)
        setProname(category.product_name)
        setProstrength(category.product_strength)
        setProquantity(category.product_quantity)
        setProdose(category.product_dose)
        setProinstruction(category.product_instruction)
     }

    if(!auth.user) return null
    return (
        <div>
            <Head>
                <title>
                    Create Prescription
                </title>
            </Head>
            <div className="d-flex" style={{marginLeft: '100px'}}>
            { service === 'Check Up' && <Link href={`/checkup/result/physical?appoint=${appoint}`}><button className="btn btn-primary text-light w-25 mx-4 my-4"> Physical Exam </button></Link>}
            { service === 'Check Up' && <Link href={`/checkup/result/visual?appoint=${appoint}`}><button className="btn btn-primary text-light w-25 mx-4 my-4"> Visual Exam </button></Link>}
            { service === 'Treatment' && <Link href={`/treatment/result?appoint=${appoint}`}><button className="btn btn-primary text-light w-25 mx-4 my-4"> Result </button></Link>}
            { service === 'Vaccination' && pet === "Dog" && <Link href={`/vaccination/result/dog_disease?appoint=${appoint}`}><button className="btn btn-primary text-light w-25 mx-4 my-4"> Dog Disease </button></Link>}
            { service === 'Vaccination' && pet === "Cat" && <Link href={`/vaccination/result/cat_disease?appoint=${appoint}`}><button className="btn btn-primary text-light w-25 mx-4 my-4"> Cat Disease </button></Link>}
            { service === 'Diagnostic Test' && <Link href={`/vaccination/result?appoint=${appoint}`}><button className="btn btn-primary text-light w-25 mx-4 my-4"> Result </button></Link>}
            { service === 'Home Visit' && <Link href={`/home_visit/result?appoint=${appoint}`}><button className="btn btn-primary text-light w-25 mx-4 my-4"> Result </button></Link>}
            <Link href="#!"><button className="btn btn-dark text-light w-25 mx-4 my-4"> Prescription </button></Link>
            </div>
                <form className='row' onSubmit={Submit}>
                        <div className='form-group'>

                            <div className='form-group input-group-prepend my-4 col-md-4 offset-md-4'>
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

                            <div className='my-5 table-responsive'>
                                <table className='table-bordered table-hover w-100 text-uppercase' style={{minWidth: '600px', cursor: 'pointer'}}>
                                    <thead className='bg-light font-weight-bold text-center'>
                                        <tr>
                                            <td className='p-2'>Product Name</td>
                                            <td className='p-2'>Product Strength / Pack Size</td>
                                            <td className='p-2'>Quantity</td>
                                            <td className='p-2'>Dose</td>
                                            <td className='p-2'>Instruction</td>                                  
                                            <td className='p-2'>Action</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className='p-2'><input type='text' name='proname' id='proname' value={proname} className="form-control d-block" onChange={(e) => setProname(e.target.value)}/></td>
                                            <td className='p-2'><input type='number' name='prostrength' id='prostrength' value={prostrength} className="form-control d-block" onChange={(e) => setProstrength(e.target.value)}/></td>
                                            <td className='p-2'><input type='number' name='proquantity' id='proquantity' value={proquantity} className="form-control d-block" onChange={(e) => setProquantity(e.target.value)}/></td>
                                            <td className='p-2'><input type='number' name='prodose' id='prodose' value={prodose} className="form-control d-block" onChange={(e) => setProdose(e.target.value)}/></td>
                                            <td className='p-2'><textarea name='proinstruction' id='proinstruction' cols={20} rows={2} value={proinstruction} className="form-control d-block" onChange={(e) => setProinstruction(e.target.value)}/></td>                                  
                                            <td className='p-2'><button type='button' className='btn btn-primary' style={{color: 'white'}} onClick={createCategory}> {Id ? 'Update' : 'Create'} </button></td> 
                                        </tr>
                                    </tbody>
                                    <tbody className='text-center'>
                                        {
                                            medicines && medicines.map(pro => (
                                                <tr key={pro._id}>
                                                    <td className='p-2 text-capitalize'>{pro.product_name}</td>
                                                    <td className='p-2'>{pro.product_strength}</td>
                                                    <td className='p-2'>{pro.product_quantity}</td>
                                                    <td className='p-2'>{pro.product_dose}</td>
                                                    <td className='p-2 text-capitalize'>{pro.product_instruction}</td>
                                                    <td className='p-2'><i className="fas fa-edit text-info mx-4 font-size-auto" onClick = {() => editCategory(pro)}></i><i className='fas fa-trash-alt text-danger mx-4 font-size-auto' aria-hidden='true' style={{fontSize: '18px'}} data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => dispatch({type: 'ADD_MODAL', payload: [{data: medicines, id: pro._id, title: pro.product_name, type: 'ADD_MEDICINE'}]})}></i></td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>

                            <div className='custom-control custom-checkbox d-flex my-4 col-md-4 offset-md-4'>
                                <input className='custom-control-input' type='checkbox' id='repeat' checked={repeat} style={{width: '20px', height: '25px', marginLeft: '10px', marginTop: '-2px'}} onChange={() => setRepeat(!repeat)}/>
                                <label className='custom-control-label' htmlFor='repeat' style={{transform: 'translate(4px, -3px)', marginRight: '10px', fontWeight: 'bold'}}> Repeat Prescription </label>
                            </div>

                            <div className='form-group input-group-prepend px-0 my-4 col-md-4 offset-md-4'>
                                <label htmlFor='no_of_repeat_prescription' style={{fontWeight: 'bold'}}> No. Of Repeat Prescription </label>
                                <input type='number' name='no_of_repeat_prescription' id='no_of_repeat_prescription' value={no_of_repeat_prescription} className="form-control d-block p-2 my-2" onChange={Handle}/>
                            </div>

                            <div className='form-group input-group-prepend px-0 my-4 col-md-4 offset-md-4'>
                                <label htmlFor='interval_between_repeat' style={{fontWeight: 'bold'}}> Interval Between Repeat </label>
                                <input type='number' name='interval_between_repeat' id='interval_between_repeat' value={interval_between_repeat} className="form-control d-block p-2 my-2" onChange={Handle}/>
                            </div>

                            <div className='form-group input-group-prepend px-0 my-4 col-md-4 offset-md-4'>
                                <label htmlFor="furthur_information" style={{fontWeight: 'bold'}}> Furthur Information </label>
                                <textarea id="furthur_information" className="form-control my-2" cols='30' rows='4' placeholder="Enter Furthur Information" name='furthur_information' value={furthur_information} onChange={Handle}/>
                            </div>

                            <div className='form-group input-group-prepend px-0 my-4 col-md-4 offset-md-4'>
                                <label htmlFor='quantity_in_each_repeat' style={{fontWeight: 'bold'}}> Quantity In Each Repeat </label>
                                <input type='number' name='quantity_in_each_repeat' id='quantity_in_each_repeat' value={quantity_in_each_repeat} className="form-control d-block p-2 my-2" onChange={Handle}/>
                            </div>

                            <div className='form-group input-group-prepend px-0 my-4 col-md-4 offset-md-4'>
                                <label htmlFor='prescription_expiry_date' style={{fontWeight: 'bold'}}> Prescription Expiry Date </label>
                                <input type='date' name='prescription_expiry_date' id='prescription_expiry_date' value={prescription_expiry_date} className="form-control d-block p-2 my-2" onChange={Handle}/>
                            </div>

                            <div className='form-group input-group-prepend px-0 my-4 col-md-4 offset-md-4'>
                                <label htmlFor='total_quantity_to_disease' style={{fontWeight: 'bold'}}> Total Quantity To Disease </label>
                                <input type='number' name='total_quantity_to_disease' id='total_quantity_to_disease' value={total_quantity_to_disease} className="form-control d-block p-2 my-2" onChange={Handle}/>
                            </div>

                            {
                            prescriptions.map(physical => (
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
                                (prescriptions.length === 0 || !submit) && !id && <div className='d-block'>
                                <button type='submit' className='btn btn-primary mb-4 col-md-4 offset-md-4' style={{color: 'white', clear: 'right', marginRight: '500px'}}> Submit </button>
                                </div>
                            }

                        </div>
                    </form>
        </div>
    )
}

export default Prescription