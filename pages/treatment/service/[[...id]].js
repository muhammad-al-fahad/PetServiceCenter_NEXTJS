import Head from 'next/head'
import {useContext, useState, useEffect} from 'react'
import { DataContext } from '../../../redux/store'
import { postData, putData, getData } from '../../../utils/fetchData'
import { useRouter } from 'next/router'

const Service = () => {

    const initial = {
        complain: '',
        pulse: 0,
        heart: 0,
        respiratory: 0,
        dehydration: 0,
        crt: '',
        mucus_membrane: '',
        facal: '',
        urine: ''
    }

    const [service, setService] = useState(initial)
    const router = useRouter()
    const {complain, pulse, heart, respiratory, dehydration, crt, mucus_membrane, facal, urine} = service

    const [onEdit, setOnEdit] = useState(false)
    const {id, appoint} = router.query

    const [temperature, setTemperature] = useState([])
    const [water, setWater] = useState(false)
    const [food, setFood] = useState(false)
    const [vomitting, setVomitting] = useState(false)
    const [coughing, setCoughing] = useState(false)
    const [sneezing, setSneezing] = useState(false)
    const [nasal, setNasal] = useState(false)
    const [occular, setOccular] = useState(false)


    const {state, dispatch} = useContext(DataContext)
    const {auth} = state

    useEffect(() => {
       setTemperature({pulse: pulse, heart: heart, respiratory: respiratory})
    }, [pulse, heart, respiratory])

    useEffect(() => {
       if(id){
            setOnEdit(true)
            getData(`treatment/service/${id}`).then(res => {
                setService({...res.service, 
                    pulse: res.service.temperature[0].pulse,
                    heart: res.service.temperature[0].heart,
                    respiratory: res.service.temperature[0].respiratory
                })
                setWater(res.service.water)
                setFood(res.service.food)
                setVomitting(res.service.vomitting)
                setCoughing(res.service.coughing)
                setSneezing(res.service.sneezing)
                setNasal(res.service.nasal)
                setOccular(res.service.occular)
            })
       }else{
            setOnEdit(false)
            setService(initial)
       }
    }, [id])

    const Handle = (props) => {
       const {name, value} = props.target
       setService({...service, [name]: value})
       dispatch({type: 'NOTIFY', payload: {}})
    }

    const Submit = async (props) => {
        props.preventDefault()

        if(!complain || temperature.length === 0 || dehydration === 0 || !crt || !mucus_membrane || !facal || !urine)
            return res.status(400).json({err: "Please fill all the fields"})

        dispatch({type: 'NOTIFY', payload: {loading: true}})
         
        let res;
        if(onEdit){

            res = await putData(`treatment/service/${id}`, {complain, temperature, food, water, vomitting, sneezing, nasal, coughing, occular, dehydration, crt, mucus_membrane, facal, urine}, auth.token)
            if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})

        }else{
            
            res = await postData('treatment/service', {appoint, complain, temperature, food, water, vomitting, sneezing, nasal, coughing, occular, dehydration, crt, mucus_membrane, facal, urine}, auth.token)
            if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})

        }

        return dispatch({type: 'NOTIFY', payload: {success: res.msg}})
    }
    
    if(!auth.user) return null;
    return(
        <div> 
            <Head>
                <title>
                    Treatment Service
                </title>
            </Head>

            <form className='row' onSubmit={Submit}>
                <div className='form-group col-md-4 offset-md-4'>

                    <div className='form-group input-group-prepend px-0 my-4'>
                        <label htmlFor='complain' style={{fontWeight: 'bold'}}>Major Complain </label>
                        <textarea name='complain' id='complain' value={complain} placeholder="Why you want to do pet treatment?" className="form-control d-block w-100 p-2 my-2" onChange={Handle}/>
                    </div>

                    <label htmlFor='temperature' style={{fontSize: '20px', fontWeight: 'bold'}}> Temperature </label>
                    <div className='form-group input-group-prepend px-0 my-2 d-block'>
                        <div className='d-flex'>
                            <label htmlFor='pulse' style={{fontWeight: 'bold'}}> Pulse Rate </label>
                            <label htmlFor='heart' style={{fontWeight: 'bold', marginLeft: '60px'}}> Heart Rate </label>
                            <label htmlFor='respiratory' style={{fontWeight: 'bold', marginLeft: '70px'}}> Respiratory Rate </label>  
                        </div>
                        <div className='d-flex'>
                            <input type="number" name='pulse' id='pulse' value={pulse} className="form-control d-block w-25 p-2 my-2 mx-0" onChange={Handle}/>
                            <input type="number" name='heart' id='heart' value={heart} className="form-control d-block w-25 p-2 my-2 mx-4" onChange={Handle}/>
                            <input type="number" name='respiratory' id='respiratory' value={respiratory} className="form-control d-block w-25 p-2 my-2 mx-4" onChange={Handle}/>
                        </div>
                    </div>

                    <div className='form-group input-group-prepend px-0 my-4 d-flex'>
                        <input type="checkbox" name='food' id='food' checked={food} className="custom-control-label d-block" onChange={() => setFood(!food)}/>
                        <label htmlFor='food' style={{fontWeight: 'bold', marginLeft: '10px'}}> Food Intake</label>
                    </div>

                    <div className='form-group input-group-prepend px-0 my-4 d-flex'>
                        <input type="checkbox" name='water' id='water' checked={water} className="custom-control-label d-block" onChange={() => setWater(!water)}/>
                        <label htmlFor='water' style={{fontWeight: 'bold', marginLeft: '10px'}}> Water Intake</label>
                    </div>

                    <div className='form-group input-group-prepend px-0 my-4 d-flex'>
                        <input type="checkbox" name='vomitting' id='vomitting' checked={vomitting} className="custom-control-label d-block" onChange={() => setVomitting(!vomitting)}/>
                        <label htmlFor='vomitting' style={{fontWeight: 'bold', marginLeft: '10px'}}> Vomitting </label>
                    </div>

                    <div className='form-group input-group-prepend px-0 my-4 d-flex'>
                        <input type="checkbox" name='coughing' id='coughing' checked={coughing} className="custom-control-label d-block" onChange={() => setCoughing(!coughing)}/>
                        <label htmlFor='coughing' style={{fontWeight: 'bold', marginLeft: '10px'}}> Coughing </label>
                    </div>

                    <div className='form-group input-group-prepend px-0 my-4 d-flex'>
                        <input type="checkbox" name='sneezing' id='sneezing' checked={sneezing} className="custom-control-label d-block" onChange={() => setSneezing(!sneezing)}/>
                        <label htmlFor='sneezing' style={{fontWeight: 'bold', marginLeft: '10px'}}> Sneezing </label>
                    </div>

                    <div className='form-group input-group-prepend px-0 my-4 d-flex'>
                        <input type="checkbox" name='nasal' id='nasal' checked={nasal} className="custom-control-label d-block" onChange={() => setNasal(!nasal)}/>
                        <label htmlFor='nasal' style={{fontWeight: 'bold', marginLeft: '10px'}}> Nasal Discharge</label>
                    </div>

                    <div className='form-group input-group-prepend px-0 my-4 d-flex'>
                        <input type="checkbox" name='occular' id='occular' checked={occular} className="custom-control-label d-block" onChange={() => setOccular(!occular)}/>
                        <label htmlFor='occular' style={{fontWeight: 'bold', marginLeft: '10px'}}> Occular Discharge</label>
                    </div>

                    <div className='form-group input-group-prepend px-0 my-4'>
                        <label htmlFor='dehydration' style={{fontWeight: 'bold'}}> Dehydration %</label>
                        <input type="number" name='dehydration' id='dehydration' value={dehydration} className="form-control d-block w-50 p-2 my-2" onChange={Handle}/>
                    </div>

                    <div className='form-group input-group-prepend px-0 my-4'>
                        <label htmlFor='crt' style={{fontWeight: 'bold'}}> CRT </label>
                        <textarea name='crt' id='crt' value={crt} className="form-control d-block w-100 p-2 my-2" onChange={Handle}/>
                    </div>

                    <div className='form-group input-group-prepend px-0 my-4'>
                        <label htmlFor='mucus_membrane' style={{fontWeight: 'bold'}}> Mucus Membrane </label>
                        <textarea name='mucus_membrane' id='mucus_membrane' value={mucus_membrane} className="form-control d-block w-100 p-2 my-2" onChange={Handle}/>
                    </div>

                    <div className='form-group input-group-prepend px-0 my-4'>
                        <label htmlFor='facal' style={{fontWeight: 'bold'}}> Facal Examination </label>
                        <textarea name='facal' id='facal' value={facal} className="form-control d-block w-100 p-2 my-2" onChange={Handle}/>
                    </div>

                    <div className='form-group input-group-prepend px-0 my-4'>
                        <label htmlFor='urine' style={{fontWeight: 'bold'}}> Urine Examination </label>
                        <textarea name='urine' id='urine' value={urine} className="form-control d-block w-100 p-2 my-2" onChange={Handle}/>
                    </div>

                    <button type='submit' className='btn btn-primary mb-3 col-md-3 offset-md-4' style={{color: 'white'}}> {onEdit ? 'Update' : 'Submit'} </button>
                </div>
            </form>
        </div>
    )
}

export default Service