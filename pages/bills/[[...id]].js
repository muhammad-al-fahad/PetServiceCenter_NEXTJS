import Head from 'next/head'
import {useContext, useState, useEffect} from 'react'
import { DataContext } from '../../redux/store'
import { postData, putData, getData } from '../../utils/fetchData'
import { useRouter } from 'next/router'

const Bill = () => {

    const initial = {
        visual: '',
        physical: '',
        treatment: '',
        diagnostic_test: '',
        vaccination: '',
        prescription: '',
        unit_cost: '',
        description: '',
        city_per_hour: 0,
        amount: ''
    }

    const [bill, setBill] = useState(initial)
    const router = useRouter()
    const {visual, physical, treatment, diagnostic_test, vaccination, prescription, unit_cost, description, city_per_hour, amount} = bill

    const [category, setCategory] = useState('')

    const [onEdit, setOnEdit] = useState(false)
    const [result, setResult] = useState([])

    const [service, setService] = useState('')
    const [user, setUser] = useState('')
    const [doctor, setDoctor] = useState('')

    const {id, appoint} = router.query

    const {state, dispatch} = useContext(DataContext)
    const {auth, appointments, visual_result, physical_result, treatment_result, cat_disease, dog_disease, diagnostic_test_result, prescriptions, petCategories} = state

    useEffect(() => {
        appointments.map(app => {
            if(app._id === appoint){
                setService(app.serviceData[0].name)
                setUser(app.user._id)
                setDoctor(app.doctor)
                petCategories.map(pet => {
                    if(app.petData[0].petCategory === pet._id) setCategory(pet.name)
                })
            }
        })

    }, [appoint])

    useEffect(() => {
       if(id){
            setOnEdit(true)
            getData(`bill/${id}`).then(res => {

                res.bill.result[0].visual && res.bill.result[0].physical && setBill({
                    ...res.bill,
                    visual: res.bill.result[0].visual[0]._id,
                    physical: res.bill.result[0].physical[0]._id,
                    prescription: res.bill.result[0].prescription[0]._id,
                })

                res.bill.result[0].treatment && setBill({
                    ...res.bill,
                    treatment: res.bill.result[0].treatment[0]._id,
                    prescription: res.bill.result[0].prescription[0]._id
                })
            
                res.bill.result[0].vaccination && setBill({
                    ...res.bill,
                    vaccination: res.bill.result[0].vaccination[0]._id,
                    prescription: res.bill.result[0].prescription[0]._id
                })

                res.bill.result[0].diagnostic_test && setBill({
                    ...res.bill,
                    diagnostic_test: res.bill.result[0].diagnostic_test[0]._id,
                    prescription: res.bill.result[0].prescription[0]._id
                })

            })
       }else{
            setOnEdit(false)
            setBill(initial)
       }
    }, [id])

    const Handle = (props) => {
       const {name, value} = props.target
       setBill({...bill, [name]: value})
       dispatch({type: 'NOTIFY', payload: {}})
    }

    const Submit = async (props) => {
        props.preventDefault()

        if(prescription === 'all' || unit_cost === 0 || !description || result.length === 0 || city_per_hour === 0 || amount === 0)
            return res.status(400).json({err: "Please fill all the fields"})
        if(service === 'Check Up'){
            if(visual === 'all' || physical === 'all') return res.status(400).json({err: "Please fill all the fields"})
        }
        if(service === 'Treatment'){
            if(treatment === 'all') return res.status(400).json({err: "Please fill all the fields"})
        }
        if(service === 'Vaccination'){
            if(vaccination === 'all'){
                if(category === 'Cat'){
                    return res.status(400).json({err: "Please fill all the fields"})
                }else {
                    return res.status(400).json({err: "Please fill all the fields"})
                }
            }
        }
        if(service === 'Diagnostic Test'){
            if(diagnostic_test === 'all') return res.status(400).json({err: "Please fill all the fields"})
        }
        dispatch({type: 'NOTIFY', payload: {loading: true}})
         
        let res;
        if(onEdit){

            res = await putData(`bill/${id}`, {appoint, service, result, unit_cost, description, city_per_hour, amount}, auth.token)
            if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})

        }else{
            
            res = await postData('bill', {appoint, user, doctor, service, result, unit_cost, description, city_per_hour, amount}, auth.token)
            if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})

        }

        return dispatch({type: 'NOTIFY', payload: {success: res.msg}})
    }

    useEffect(() => {

        if(service === 'Check Up'){
            let vis = []
            let phy = []
            let pres = []

            visual_result && visual_result.map(visual => {
                if(visual.appointment === appoint) vis.push(visual)
            })
            physical_result && physical_result.map(physical => {
                if(physical.appointment === appoint) phy.push(physical)
            })
            prescriptions && prescriptions.map(prescript => {
                if(prescript.appointment === appoint) pres.push(prescript)
            })

            setResult({physical: phy, visual: vis, prescription: pres})
        }
    }, [visual, physical, prescription, service])

    useEffect(() => {
        if(service === 'Treatment'){
            let tea = []
            let pres = []

            treatment_result && treatment_result.map(treat => {
                if(treat.appointment === appoint) tea.push(treat)
            })
            prescriptions && prescriptions.map(prescript => {
                if(prescript.appointment === appoint) pres.push(prescript)
            })

            setResult({treatment: tea, prescription: pres})
        }

    }, [treatment, prescription, service])

    useEffect(() => {
        if(service === 'Vaccination'){
            if(category === 'Cat'){

                let cat = []
                let pres = []

                cat_disease && cat_disease.map(treat => {
                    if(treat.appointment === appoint) cat.push(treat)
                })
                prescriptions && prescriptions.map(prescript => {
                    if(prescript.appointment === appoint) pres.push(prescript)
                })

                setResult({vaccination: cat, prescription: pres})
            }else {

                let dog = []
                let pres = []

                dog_disease && dog_disease.map(treat => {
                    if(treat.appointment === appoint) dog.push(treat)
                })
                prescriptions && prescriptions.map(prescript => {
                    if(prescript.appointment === appoint) pres.push(prescript)
                })

                setResult({vaccination: dog, prescription: pres})
            }
        }
    }, [vaccination, prescription, service])

    useEffect(() => {
        if(service === 'Diagnostic Test'){
            let test = []
            let pres = []

            diagnostic_test_result && diagnostic_test_result.map(treat => {
                if(treat.appointment === appoint) test.push(treat)
            })
            prescriptions && prescriptions.map(prescript => {
                if(prescript.appointment === appoint) pres.push(prescript)
            })

            setResult({diagnostic_test: test, prescription: pres})
        }

    }, [diagnostic_test, prescription, service])
    
    if(!auth.user) return null;
    return(
        <div> 
            <Head>
                <title>
                    Bill Generation
                </title>
            </Head>

            <form className='row' onSubmit={Submit}>
                <div className='form-group'>
                    {
                        service === 'Check Up' && <div>
                            <div className='form-group input-group-prepend col-md-4 offset-md-4 my-4'>
                                <label htmlFor='visual' style={{fontWeight: 'bold'}}> Visual Examination </label>
                                <select name='visual' value={visual} onChange={Handle} className="form-control text-capitalize mt-2 w-100">
                                    <option value='all'> All Examinations  </option>
                                    {
                                        visual_result.map(animal => (
                                            appoint === animal.appointment && <option key={animal._id} value={animal._id}> {animal._id} </option>
                                        ))
                                    }
                                </select>
                            </div>

                            <div className='form-group input-group-prepend col-md-4 offset-md-4 my-4'>
                                <label htmlFor='physical' style={{fontWeight: 'bold'}}> Physical Examination </label>
                                <select name='physical' value={physical} onChange={Handle} className="form-control text-capitalize mt-2 w-100">
                                    <option value='all'> All Examinations </option>
                                    {
                                        physical_result.map(animal => (
                                            appoint === animal.appointment && <option key={animal._id} value={animal._id}> {animal._id} </option>
                                        ))
                                    }
                                </select>
                            </div>
                        </div>
                    }
                    {
                        service === 'Treatment' && 
                        <div className='form-group input-group-prepend col-md-4 offset-md-4 my-4'>
                            <label htmlFor='treatment' style={{fontWeight: 'bold'}}> Treatment Result </label>
                            <select name='treatment' value={treatment} onChange={Handle} className="form-control text-capitalize mt-2 w-100">
                                <option value='all'> All Results  </option>
                                {
                                    treatment_result.map(animal => (
                                        appoint === animal.appointment && <option key={animal._id} value={animal._id}> {animal._id} </option>
                                    ))
                                }
                            </select>
                        </div>
                    }
                    {
                        service === 'Vaccination' && 
                        <div className='form-group input-group-prepend col-md-4 offset-md-4 my-4'>
                            <label htmlFor='vaccination' style={{fontWeight: 'bold'}}> Vaccination Result </label>
                            <select name='vaccination' value={vaccination} onChange={Handle} className="form-control text-capitalize mt-2 w-100">
                                <option value='all'> All Results  </option>
                                {
                                    category === 'Cat' && cat_disease.map(animal => (
                                        appoint === animal.appointment && <option key={animal._id} value={animal._id}> {animal._id} </option>
                                    ))
                                }
                                {
                                    category === 'Dog' && dog_disease.map(animal => (
                                        appoint === animal.appointment && <option key={animal._id} value={animal._id}> {animal._id} </option>
                                    ))
                                }
                            </select>
                        </div>
                    }
                    {
                        service === 'Diagnostic Test' && 
                        <div className='form-group input-group-prepend col-md-4 offset-md-4 my-4'>
                            <label htmlFor='diagnostic_test' style={{fontWeight: 'bold'}}> Diagnostic Test Result </label>
                            <select name='diagnostic_test' value={diagnostic_test} onChange={Handle} className="form-control text-capitalize mt-2 w-100">
                                <option value='all'> All Results  </option>
                                {
                                    diagnostic_test_result.map(animal => (
                                        appoint === animal.appointment && <option key={animal._id} value={animal._id}> {animal._id} </option>
                                    ))
                                }
                            </select>
                        </div>
                    }

                    <div className='form-group input-group-prepend col-md-4 offset-md-4 my-4'>
                        <label htmlFor='prescription' style={{fontWeight: 'bold'}}> Prescription</label>
                        <select name='prescription' value={prescription} onChange={Handle} className="form-control text-capitalize mt-2 w-100">
                            <option value='all'> All prescriptions </option>
                            {
                                prescriptions.map(animal => (
                                    appoint === animal.appointment && <option key={animal._id} value={animal._id}> {animal._id} </option>
                                ))
                            }
                        </select>
                    </div>

                    <div className='form-group input-group-prepend col-md-4 offset-md-4 my-4'>
                        <label htmlFor='unit_cost' style={{fontWeight: 'bold'}}> Unit Cost </label>
                        <input type='text' name='unit_cost' id='unit_cost' value={unit_cost} placeholder="Enter Unit Cost" className="form-control d-block w-100 p-2 my-2" onChange={Handle}/>
                    </div>

                    <div className='form-group input-group-prepend col-md-4 offset-md-4 my-4'>
                        <label htmlFor='description' style={{fontWeight: 'bold'}}> Description </label>
                        <textarea name='description' id='description' cols={20} rows={4} placeholder="Enter Bill Descriptions" value={description} className="form-control d-block w-100 p-2 my-2" onChange={Handle}/>
                    </div>

                    <div className='form-group input-group-prepend col-md-4 offset-md-4 my-4'>
                        <label htmlFor='city_per_hour' style={{fontWeight: 'bold'}}> City /Hour Rate </label>
                        <input type='number' name='city_per_hour' id='city_per_hour' value={city_per_hour} className="form-control d-block w-100 p-2 my-2" onChange={Handle}/>
                    </div>

                    <div className='form-group input-group-prepend col-md-4 offset-md-4 my-4'>
                        <label htmlFor='amount' style={{fontWeight: 'bold'}}> Amount </label>
                        <input type='text' name='amount' id='amount' value={amount} placeholder="Enter Amount" className="form-control d-block w-100 p-2 my-2" onChange={Handle}/>
                    </div>

                    <button type='submit' className='btn btn-primary mb-3 col-md-4 offset-md-4' style={{color: 'white'}} disabled={service === 'Home Visit' ? true : false}> {onEdit ? 'Update' : 'Submit'} </button>
                    {service === 'Home Visit' && <em style={{color: 'crimson', marginLeft: '565px'}}>* For home visit bill is not created *</em>}
                </div>
            </form>
        </div>
    )
}

export default Bill