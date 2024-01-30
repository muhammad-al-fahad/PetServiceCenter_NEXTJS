import Head from 'next/head'
import {useContext, useState, useEffect} from 'react'
import { DataContext } from '../../../redux/store'
import { postData, putData, getData } from '../../../utils/fetchData'
import { useRouter } from 'next/router'

const Service = () => {

    const initial = {
        body_condition: '',
        body_condition_score: '',
        behavior: '',
        posture: '',
        gait: '',
        defecation: '',
        urination: '',
        voice: '',
        cough: ''
    }

    const [service, setService] = useState(initial)
    const router = useRouter()
    const {body_condition, body_condition_score, behavior, posture, gait, defecation, urination, voice, cough} = service

    const [onEdit, setOnEdit] = useState(false)
    const {id, appoint} = router.query

    const {state, dispatch} = useContext(DataContext)
    const {auth} = state

    useEffect(() => {
       if(id){
            setOnEdit(true)
            getData(`checkup/service/${id}`).then(res => {
                setService(res.service)
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

        if(body_condition === 'all' || !body_condition_score || behavior === 'all' || posture === 'all' || gait === 'all' || defecation === 'all' || urination === 'all' || voice === 'all' || cough === 'all')
            return dispatch({type: 'NOTIFY', payload: {error: "Please fill all the fields"}})

        dispatch({type: 'NOTIFY', payload: {loading: true}})
         
        let res;
        if(onEdit){

            res = await putData(`checkup/service/${id}`, {body_condition, body_condition_score, behavior, posture, gait, defecation, urination, voice, cough}, auth.token)
            if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})

        }else{
            
            res = await postData('checkup/service', {appoint, body_condition, body_condition_score, behavior, posture, gait, defecation, urination, voice, cough}, auth.token)
            if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})

        }

        return dispatch({type: 'NOTIFY', payload: {success: res.msg}})
    }
    
    if(!auth.user) return null;
    return(
        <div> 
            <Head>
                <title>
                    Checkup Service
                </title>
            </Head>

            <form className='row' onSubmit={Submit}>
                <div className='form-group col-md-4 offset-md-4'>

                    <div className='form-group input-group-prepend px-0 my-4'>
                        <label htmlFor='body_condition' style={{fontWeight: 'bold'}}> Body Condition </label>
                        <select name='body_condition' value={body_condition} onChange={Handle} className="form-control text-capitalize my-2 w-100">
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
                        <label htmlFor='body_condition_score' style={{fontWeight: 'bold'}}> Body Condition Score </label>
                        <input type='text' name='body_condition_score' id='body_condition_score' value={body_condition_score} placeholder=" Enter Score Of Pet Body Condition" className="form-control d-block w-100 p-2 my-2" onChange={Handle}/>
                    </div>

                    <div className='form-group input-group-prepend px-0 my-4'>
                        <label htmlFor='behavior' style={{fontWeight: 'bold'}}> Behavior </label>
                        <select name='behavior' value={behavior} onChange={Handle} className="form-control text-capitalize my-2 w-100">
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
                        <label htmlFor='posture' style={{fontWeight: 'bold'}}> Posture </label>
                        <select name='posture' value={posture} onChange={Handle} className="form-control text-capitalize my-2 w-100">
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
                        <label htmlFor='gait' style={{fontWeight: 'bold'}}> Gait </label>
                        <select name='gait' value={gait} onChange={Handle} className="form-control text-capitalize my-2 w-100">
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
                        <label htmlFor='defecation' style={{fontWeight: 'bold'}}> Defecation </label>
                        <select name='defecation' value={defecation} onChange={Handle} className="form-control text-capitalize my-2 w-100">
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
                        <label htmlFor='urination' style={{fontWeight: 'bold'}}> Urination </label>
                        <select name='urination' value={urination} onChange={Handle} className="form-control text-capitalize my-2 w-100">
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
                        <label htmlFor='voice' style={{fontWeight: 'bold'}}> Voice </label>
                        <select name='voice' value={voice} onChange={Handle} className="form-control text-capitalize my-2 w-100">
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
                        <label htmlFor='cough' style={{fontWeight: 'bold'}}> Cough </label>
                        <select name='cough' value={cough} onChange={Handle} className="form-control text-capitalize my-2 w-100">
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
                    <button type='submit' className='btn btn-primary mb-3 col-md-3 offset-md-4' style={{color: 'white'}}> {onEdit ? 'Update' : 'Submit'} </button>
                </div>
            </form>
        </div>
    )
}

export default Service