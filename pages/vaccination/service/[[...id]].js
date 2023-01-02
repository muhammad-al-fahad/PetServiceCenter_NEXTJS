import Head from 'next/head'
import {useContext, useState, useEffect} from 'react'
import { DataContext } from '../../../redux/store'
import { postData, putData, getData } from '../../../utils/fetchData'
import { useRouter } from 'next/router'

const Service = () => {

    const initial = {
        physical: '',
        visual: '',
        purpose: '',
        dose: '',
        no_of_doses: 0,
        interval: 0,
        diagnostic_test: ''
    }

    const [service, setService] = useState(initial)
    const router = useRouter()
    const {physical, visual, purpose, dose, no_of_doses, interval, diagnostic_test} = service

    const [onEdit, setOnEdit] = useState(false)
    const {id, appoint} = router.query

    const [checkup_result, setCheckup_result] = useState([])
    const [repeat_doses, setRepeatDoses] = useState(false)

    const {state, dispatch} = useContext(DataContext)
    const {auth, physical_result, visual_result, diagnostic_test_result} = state

    useEffect(() => {
        setCheckup_result({physical: physical, visual: visual})
    }, [physical, visual])

    useEffect(() => {
       if(id){
            setOnEdit(true)
            getData(`vaccination/service/${id}`).then(res => {
                setService({...res.service, physical: res.service.checkup_result[0].physical, visual: res.service.checkup_result[0].visual})
                setRepeatDoses(res.service.repeat_doses)
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

        if(!purpose || no_of_doses === 0 || dose === 'all' || interval === 0)
            return dispatch({type: 'NOTIFY', payload: {error: "Please fill all the fields"}})

        dispatch({type: 'NOTIFY', payload: {loading: true}})
         
        let res;
        if(onEdit){

            res = await putData(`vaccination/service/${id}`, {checkup_result, purpose, dose, no_of_doses, repeat_doses, interval, diagnostic_test}, auth.token)
            if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})

        }else{
            
            res = await postData('vaccination/service', {appoint, checkup_result, purpose, dose, no_of_doses, repeat_doses, interval, diagnostic_test}, auth.token)
            if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})

        }

        return dispatch({type: 'NOTIFY', payload: {success: res.msg}})
    }
    
    if(!auth.user) return null;
    return(
        <div> 
            <Head>
                <title>
                    Vaccination Service
                </title>
            </Head>

            <form className='row' onSubmit={Submit}>
                <div className='form-group col-md-4 offset-md-4'>

                    <div className='form-group input-group-prepend px-0 my-4'>
                        <label htmlFor='purpose' style={{fontWeight: 'bold'}}>Purpose </label>
                        <textarea name='purpose' id='purpose' value={purpose} placeholder="Why you want to do pet vaccine?" className="form-control d-block w-100 p-2 my-2" onChange={Handle}/>
                    </div>
                    
                    <div className='form-group input-group-prepend px-0 my-4'>
                        <label htmlFor='dose' style={{fontWeight: 'bold'}}> Dose </label>
                        <select name='dose' value={dose} onChange={Handle} className="form-control text-capitalize my-2 w-100">
                            <option value='all'> All </option>
                            <option value='naciteris'> Naciteris </option>
                        </select>
                    </div>

                    <div className='form-group input-group-prepend px-0 my-4'>
                        <label htmlFor='no_of_doses' style={{fontWeight: 'bold'}}> No Of Doses </label>
                        <input type="number" name='no_of_doses' id='no_of_doses' value={no_of_doses} className="form-control d-block w-50 p-2 my-2" onChange={Handle}/>
                    </div>

                    <div className='custom-control custom-checkbox px-0 my-2 d-flex'>
                            <input type="checkbox" className='custom-control-input' style={{width: '20px', height: '25px', marginLeft: '10px', marginTop: '-2px'}} checked={repeat_doses} onChange={() => setRepeatDoses(!repeat_doses)}/>
                            <label htmlFor='repeat_doses' className='custom-control-label' style={{fontWeight: 'bold', marginLeft: '10px'}}> Repeat Doses </label>
                    </div>

                    <div className='form-group input-group-prepend px-0 my-4'>
                        <label htmlFor='interval' style={{fontWeight: 'bold'}}> Interval Between Repeat/day </label>
                        <input type="number" name='interval' id='interval' value={interval} className="form-control d-block w-50 p-2 my-2" onChange={Handle}/>
                    </div>

                    <h4 style={{fontWeight: 'bold'}}> Checkup Report</h4>
                    <div className='form-group input-group-prepend px-0 my-4'>
                        <label htmlFor='physical' style={{fontWeight: 'bold'}}> Physical Examination </label>
                        <select name='physical' value={physical} onChange={Handle} className="form-control text-capitalize my-2 w-100">
                            <option value='all'> All </option>
                            {
                                physical_result.map(physical => (
                                    <option key={physical._id} value={physical._id}> {physical._id} </option>
                                ))
                            } 
                        </select>
                    </div>

                    <div className='form-group input-group-prepend px-0 my-4'>
                        <label htmlFor='visual' style={{fontWeight: 'bold'}}> Visual Examination </label>
                        <select name='visual' value={visual} onChange={Handle} className="form-control text-capitalize my-2 w-100">
                            <option value='all'> All </option>
                            {
                                visual_result.map(physical => (
                                    <option key={physical._id} value={physical._id}> {physical._id} </option>
                                ))
                            } 
                        </select>
                    </div>

                    <div className='form-group input-group-prepend px-0 my-4'>
                        <label htmlFor='diagnostic_test' style={{fontWeight: 'bold'}}> Diagnostic Test </label>
                        <select name='diagnostic_test' value={diagnostic_test} onChange={Handle} className="form-control text-capitalize my-2 w-100">
                            <option value='all'> All </option>
                            {
                                diagnostic_test_result.map(physical => (
                                    <option key={physical._id} value={physical._id}> {physical._id} </option>
                                ))
                            } 
                        </select>
                    </div>

                    <button type='submit' className='btn btn-primary mb-3 col-md-3 offset-md-4' style={{color: 'white'}}> {onEdit ? 'Update' : 'Submit'} </button>
                </div>
            </form>
        </div>
    )
}

export default Service