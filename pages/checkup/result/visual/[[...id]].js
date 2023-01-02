import Head from 'next/head'
import Link from 'next/link'
import {useContext, useState, useEffect} from 'react'
import { DataContext } from '../../../../redux/store'
import { postData, putData, getData } from '../../../../utils/fetchData'
import { useRouter } from 'next/router'

const Visual = () => {

    const initial = {
        operator: '',
        face: '',
        ears: '',
        horns: '',
        eyes: '',
        sclera: '',
        muzzle: '',
        nostrils: '',
        mouth: '',
        neck: '',
        chest: '',
        abdomen: '',
        udder: '',
        ganitalia: '',
        limbs: '',
        tail: '',
        lymph: '',
        skin: '',
        faeces: '',
        urine: ''
    }

    const [result, setResult] = useState(initial)
    const router = useRouter()
    const {
        operator,
        face,
        ears,
        horns,
        eyes,
        sclera,
        muzzle,
        nostrils,
        mouth,
        neck,
        chest,
        abdomen,
        udder,
        ganitalia,
        limbs,
        tail,
        lymph_nodes,
        skin,
        faeces,
        urine
    } = result

    const [onEdit, setOnEdit] = useState(false)
    const {id, appoint} = router.query

    const [submit, setSubmit] = useState(false)
    const [user, setUser] = useState('')

    const {state, dispatch} = useContext(DataContext)
    const {operators, visual_result, appointments, auth} = state

    useEffect(() => {
        visual_result.map(pres => {
          if(pres.appointment === appoint) setSubmit(true)
        })
    }, [visual_result])

    useEffect(() => {
        appointments.map(app => {
           if(app._id === appoint) setUser(app.user._id)
        })
   }, [appointments])

    useEffect(() => {
       if(id){
            setOnEdit(true)
            getData(`checkup/visual/${id}`).then(res => {
                setResult(res.visual)
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
            !operator ||
            !user ||
            face === 'all' || 
            horns === 'all' || 
            ears === 'all' || 
            skin === 'all' || 
            eyes === 'all' || 
            sclera === 'all' || 
            muzzle === 'all' || 
            mouth === 'all' ||
            neck === 'all' ||
            chest === 'all' ||
            lymph_nodes === 'all' ||
            nostrils === 'all' ||
            tail === 'all' ||
            faeces === 'all' ||
            urine === 'all' ||
            abdomen === 'all' ||
            udder === 'all' ||
            ganitalia === 'all' ||
            limbs === 'all'
        )
            return dispatch({type: 'NOTIFY', payload: {error: "Please fill all the fields"}})

        dispatch({type: 'NOTIFY', payload: {loading: true}})
         
        let res;
        if(onEdit){

            res = await putData(`checkup/visual/${id}`, {operator, faeces, face, horns, ears, eyes, neck, chest, nostrils, sclera, skin, mouth, muzzle, limbs, lymph_nodes, tail, udder, urine, ganitalia, abdomen}, auth.token)
            if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})

        }else{
            
            res = await postData('checkup/visual', {appoint, operator, user, faeces, face, horns, ears, eyes, neck, chest, nostrils, sclera, skin, mouth, muzzle, limbs, lymph_nodes, tail, udder, urine, ganitalia, abdomen}, auth.token)
            if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})

        }

        return dispatch({type: 'NOTIFY', payload: {success: res.msg}})
    }
    
    if(!auth.user) return null;
    return(
        <div> 
            <Head>
                <title>
                    Create Checkup Visual Result
                </title>
            </Head>
            <div className="d-flex" style={{marginLeft: '100px'}}>
            <Link href={`/checkup/result/physical?appoint=${appoint}`}><button className="btn btn-primary text-light w-25 mx-4 my-4"> Physical Exam </button></Link>
            <Link href="#!"><button className="btn btn-dark text-light w-25 mx-4 my-4"> Visual Exam </button></Link>
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
                                <label htmlFor='face' style={{fontWeight: 'bold'}}> Face </label>
                                <select name='face' value={face} onChange={Handle} className="form-control text-capitalize my-2 w-100">
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
                                <label htmlFor='ears' style={{fontWeight: 'bold'}}> Ears </label>
                                <select name='ears' value={ears} onChange={Handle} className="form-control text-capitalize my-2 w-100">
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
                                <label htmlFor='horns' style={{fontWeight: 'bold'}}> Horns </label>
                                <select name='horns' value={horns} onChange={Handle} className="form-control text-capitalize my-2 w-100">
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
                                <label htmlFor='sclera' style={{fontWeight: 'bold'}}> Sclera </label>
                                <select name='sclera' value={sclera} onChange={Handle} className="form-control text-capitalize my-2 w-100">
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
                                <label htmlFor='eyes' style={{fontWeight: 'bold'}}> Eyes </label>
                                <select name='eyes' value={eyes} onChange={Handle} className="form-control text-capitalize my-2 w-100">
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
                                <label htmlFor='muzzle' style={{fontWeight: 'bold'}}> Muzzle </label>
                                <select name='muzzle' value={muzzle} onChange={Handle} className="form-control text-capitalize my-2 w-100">
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
                                <label htmlFor='mouth' style={{fontWeight: 'bold'}}> Mouth </label>
                                <select name='mouth' value={mouth} onChange={Handle} className="form-control text-capitalize my-2 w-100">
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
                                <label htmlFor='neck' style={{fontWeight: 'bold'}}> Neck </label>
                                <select name='neck' value={neck} onChange={Handle} className="form-control text-capitalize my-2 w-100">
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
                                <label htmlFor='chest' style={{fontWeight: 'bold'}}> Chest </label>
                                <select name='chest' value={chest} onChange={Handle} className="form-control text-capitalize my-2 w-100">
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
                                <label htmlFor='abdomen' style={{fontWeight: 'bold'}}> Abdomen </label>
                                <select name='abdomen' value={abdomen} onChange={Handle} className="form-control text-capitalize my-2 w-100">
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
                                <label htmlFor='udder' style={{fontWeight: 'bold'}}> Udder </label>
                                <select name='udder' value={udder} onChange={Handle} className="form-control text-capitalize my-2 w-100">
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
                                <label htmlFor='ganitalia' style={{fontWeight: 'bold'}}> Ganitalia </label>
                                <select name='ganitalia' value={ganitalia} onChange={Handle} className="form-control text-capitalize my-2 w-100">
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
                                <label htmlFor='limbs' style={{fontWeight: 'bold'}}> Limbs </label>
                                <select name='limbs' value={limbs} onChange={Handle} className="form-control text-capitalize my-2 w-100">
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
                                <label htmlFor='lymph_nodes' style={{fontWeight: 'bold'}}> Lymph Nodes </label>
                                <select name='lymph_nodes' value={lymph_nodes} onChange={Handle} className="form-control text-capitalize my-2 w-100">
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
                                <label htmlFor='faeces' style={{fontWeight: 'bold'}}> Faeces </label>
                                <select name='faeces' value={faeces} onChange={Handle} className="form-control text-capitalize my-2 w-100">
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
                                <label htmlFor='urine' style={{fontWeight: 'bold'}}> Urine </label>
                                <select name='urine' value={urine} onChange={Handle} className="form-control text-capitalize my-2 w-100">
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
                            visual_result.map(physical => (
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
                                (visual_result.length === 0 || !submit) && !id &&<div className='d-block'>
                                <button type='submit' className='btn btn-primary mb-4 col-md-4 offset-md-4' style={{color: 'white', clear: 'right', marginRight: '500px'}}> Submit </button>
                                </div>
                            }
                        </div>
                    </form>   
        </div>
    )
}

export default Visual