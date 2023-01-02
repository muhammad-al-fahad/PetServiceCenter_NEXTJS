import Head from 'next/head'
import {useContext, useState, useEffect} from 'react'
import { DataContext } from '../../../redux/store'
import { postData, putData, getData } from '../../../utils/fetchData'
import { useRouter } from 'next/router'

const Service = () => {

    const initial = {
        purpose: '',
        test: '',
        physician_test: '',
        cardiology_test: '',
        neptrology_test: '',
    }

    const [service, setService] = useState(initial)
    const router = useRouter()
    const {purpose, test, physician_test, cardiology_test, neptrology_test} = service

    const [onEdit, setOnEdit] = useState(false)
    const {id, appoint} = router.query

    const [signs_pet, setSigns_pet] = useState([])

    const [lethargy, setLethargy] = useState(false)
    const [fatigue, setFatigue] = useState(false)
    const [persistant_cough, setPersistant_cough] = useState(false)
    const [loss_appetite, setLoss_appetite] = useState(false)
    const [swollen_abdomen, setSwollen_abdomen] = useState(false)
    const [heat_failure, setHeat_failure] = useState(false)
    const [weight_loss, setWeight_loss] = useState(false)
    const [reluctance_excercise, setReluctance_excercise] = useState(false)
    const [hair_loss, setHair_loss] = useState(false)
    const [increase_urination, setIncrease_urination] = useState(false)
    const [decrease_appetite, setDecrease_appetite] = useState(false)
    const [billing_skin, setBilling_skin] = useState(false)

    const {state, dispatch} = useContext(DataContext)
    const {auth} = state

    useEffect(() => {
        setSigns_pet({
            lethargy: lethargy, 
            fatigue: fatigue, 
            persistant_cough: persistant_cough, 
            loss_appetite: loss_appetite, 
            swollen_abdomen: swollen_abdomen,
            heat_failure: heat_failure,
            weight_loss: weight_loss,
            reluctance_excercise: reluctance_excercise,
            hair_loss: hair_loss,
            increase_urination: increase_urination,
            decrease_appetite: decrease_appetite,
            billing_skin: billing_skin
        })
    }, [lethargy, fatigue, persistant_cough, loss_appetite, swollen_abdomen, heat_failure, weight_loss, reluctance_excercise, hair_loss, increase_urination, decrease_appetite, billing_skin])

    useEffect(() => {
       if(id){
            setOnEdit(true)
            getData(`diagnostic_test/service/${id}`).then(res => {
                setService(res.service)
                setLethargy(res.service.signs_pet[0].lethargy)
                setFatigue(res.service.signs_pet[0].fatigue)
                setPersistant_cough(res.service.signs_pet[0].persistant_cough)
                setLoss_appetite(res.service.signs_pet[0].loss_appetite)
                setSwollen_abdomen(res.service.signs_pet[0].swollen_abdomen)
                setHeat_failure(res.service.signs_pet[0].heat_failure)
                setWeight_loss(res.service.signs_pet[0].weight_loss)
                setReluctance_excercise(res.service.signs_pet[0].reluctance_excercise)
                setHair_loss(res.service.signs_pet[0].hair_loss)
                setIncrease_urination(res.service.signs_pet[0].increase_urination)
                setDecrease_appetite(res.service.signs_pet[0].decrease_appetite)
                setBilling_skin(res.service.signs_pet[0].billing_skin)
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

        if(!purpose || signs_pet.length === 0 || !physician_test || !cardiology_test || !neptrology_test || !test)
            return res.status(400).json({err: "Please fill all the fields"})

        dispatch({type: 'NOTIFY', payload: {loading: true}})
         
        let res;
        if(onEdit){

            res = await putData(`diagnostic_test/service/${id}`, {purpose, signs_pet, test, physician_test, cardiology_test, neptrology_test}, auth.token)
            if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})

        }else{
            
            res = await postData('diagnostic_test/service', {appoint, purpose, signs_pet, test, physician_test, cardiology_test, neptrology_test}, auth.token)
            if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})

        }

        return dispatch({type: 'NOTIFY', payload: {success: res.msg}})
    }
    
    if(!auth.user) return null;
    return(
        <div> 
            <Head>
                <title>
                    Diagnostic Test Service
                </title>
            </Head>

            <form className='row' onSubmit={Submit}>
                <div className='form-group col-md-4 offset-md-4'>

                    <div className='form-group input-group-prepend px-0 my-4'>
                        <label htmlFor='purpose' style={{fontWeight: 'bold'}}>Purpose </label>
                        <textarea name='purpose' id='purpose' value={purpose} placeholder="Why you want to do pet test?" className="form-control d-block w-100 p-2 my-2" onChange={Handle}/>
                    </div>

                    <div className='form-group input-group-prepend px-0 my-4'>
                        <label htmlFor='test' style={{fontWeight: 'bold'}}> Choose Test </label>
                        <select name='test' value={test} onChange={Handle} className="form-control text-capitalize my-2 w-100">
                            <option value='all'> All </option>
                            <option value='leg'> Leg </option>
                            <option value='chest'> Chest </option>
                            <option value='face'> Face </option>
                            <option value='urine'> Urine </option>
                            <option value='others'> Others </option>
                        </select>
                    </div>

                    <div className='form-group input-group-prepend px-0 my-4'>
                        <label htmlFor='physician_test' style={{fontWeight: 'bold'}}> General Physician Test </label>
                        <select name='physician_test' value={physician_test} onChange={Handle} className="form-control text-capitalize my-2 w-100">
                            <option value='all'> All </option>
                            <option value='others'> Others </option>
                        </select>
                    </div>

                    <div className='form-group input-group-prepend px-0 my-4'>
                        <label htmlFor='cardiology_test' style={{fontWeight: 'bold'}}> Cardiology Test </label>
                        <select name='cardiology_test' value={cardiology_test} onChange={Handle} className="form-control text-capitalize my-2 w-100">
                            <option value='all'> All </option>
                            <option value='others'> Others </option>
                        </select>
                    </div>

                    <div className='form-group input-group-prepend px-0 my-4'>
                        <label htmlFor='neptrology_test' style={{fontWeight: 'bold'}}> Neptrology Test </label>
                        <select name='neptrology_test' value={neptrology_test} onChange={Handle} className="form-control text-capitalize my-2 w-100">
                            <option value='all'> All </option>
                            <option value='others'> Others </option>
                        </select>
                    </div>

                    <h4 style={{fontWeight: 'bold'}}> Signs Of Pet </h4>

                    <div className='form-group input-group-prepend px-0 my-4 d-flex'>
                        <input type="checkbox" checked={lethargy} className="custom-control-label d-block" onChange={() => setLethargy(!lethargy)}/>
                        <label htmlFor='lethargy' style={{fontWeight: 'bold', marginLeft: '10px'}}> Lethargy </label>
                    </div>

                    <div className='form-group input-group-prepend px-0 my-4 d-flex'>
                        <input type="checkbox" checked={fatigue} className="custom-control-label d-block" onChange={() => setFatigue(!fatigue)}/>
                        <label htmlFor='fatigue' style={{fontWeight: 'bold', marginLeft: '10px'}}> Fatigue </label>
                    </div>

                    <div className='form-group input-group-prepend px-0 my-4 d-flex'>
                        <input type="checkbox" checked={persistant_cough} className="custom-control-label d-block" onChange={() => setPersistant_cough(!persistant_cough)}/>
                        <label htmlFor='persistant_cough' style={{fontWeight: 'bold', marginLeft: '10px'}}> Persistant Cough </label>
                    </div>

                    <div className='form-group input-group-prepend px-0 my-4 d-flex'>
                        <input type="checkbox" checked={loss_appetite} className="custom-control-label d-block" onChange={() => setLoss_appetite(!loss_appetite)}/>
                        <label htmlFor='loss_appetite' style={{fontWeight: 'bold', marginLeft: '10px'}}> Loss Appetite </label>
                    </div>

                    <div className='form-group input-group-prepend px-0 my-4 d-flex'>
                        <input type="checkbox" checked={swollen_abdomen} className="custom-control-label d-block" onChange={() => setSwollen_abdomen(!swollen_abdomen)}/>
                        <label htmlFor='swollen_abdomen' style={{fontWeight: 'bold', marginLeft: '10px'}}> Swollen Abdomen </label>
                    </div>

                    <div className='form-group input-group-prepend px-0 my-4 d-flex'>
                        <input type="checkbox" checked={heat_failure} className="custom-control-label d-block" onChange={() => setHeat_failure(!heat_failure)}/>
                        <label htmlFor='heat_failure' style={{fontWeight: 'bold', marginLeft: '10px'}}> Heat Failure</label>
                    </div>

                    <div className='form-group input-group-prepend px-0 my-4 d-flex'>
                        <input type="checkbox" checked={weight_loss} className="custom-control-label d-block" onChange={() => setWeight_loss(!weight_loss)}/>
                        <label htmlFor='weight_loss' style={{fontWeight: 'bold', marginLeft: '10px'}}> Weight Loss</label>
                    </div>

                    <div className='form-group input-group-prepend px-0 my-4 d-flex'>
                        <input type="checkbox" checked={reluctance_excercise} className="custom-control-label d-block" onChange={() => setReluctance_excercise(!reluctance_excercise)}/>
                        <label htmlFor='reluctance_excercise' style={{fontWeight: 'bold', marginLeft: '10px'}}> Reluctance Excercise</label>
                    </div>

                    <div className='form-group input-group-prepend px-0 my-4 d-flex'>
                        <input type="checkbox" checked={hair_loss} className="custom-control-label d-block" onChange={() => setHair_loss(!hair_loss)}/>
                        <label htmlFor='hair_loss' style={{fontWeight: 'bold', marginLeft: '10px'}}> Hair Loss</label>
                    </div>

                    <div className='form-group input-group-prepend px-0 my-4 d-flex'>
                        <input type="checkbox" checked={increase_urination} className="custom-control-label d-block" onChange={() => setIncrease_urination(!increase_urination)}/>
                        <label htmlFor='increase_urination' style={{fontWeight: 'bold', marginLeft: '10px'}}> Increase Urination</label>
                    </div>

                    <div className='form-group input-group-prepend px-0 my-4 d-flex'>
                        <input type="checkbox" checked={decrease_appetite} className="custom-control-label d-block" onChange={() => setDecrease_appetite(!decrease_appetite)}/>
                        <label htmlFor='decrease_appetite' style={{fontWeight: 'bold', marginLeft: '10px'}}> Decrease Appetite</label>
                    </div>

                    <div className='form-group input-group-prepend px-0 my-4 d-flex'>
                        <input type="checkbox" checked={billing_skin} className="custom-control-label d-block" onChange={() => setBilling_skin(!billing_skin)}/>
                        <label htmlFor='billing_skin' style={{fontWeight: 'bold', marginLeft: '10px'}}> Billing Own Skin</label>
                    </div>

                    <button type='submit' className='btn btn-primary mb-3 col-md-3 offset-md-4' style={{color: 'white'}}> {onEdit ? 'Update' : 'Submit'} </button>
                </div>
            </form>
        </div>
    )
}

export default Service