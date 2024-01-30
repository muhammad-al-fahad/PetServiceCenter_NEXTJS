import Head from 'next/head'
import {useContext, useState, useEffect} from 'react'
import { DataContext } from '../../../redux/store'
import { postData, putData, getData } from '../../../utils/fetchData'
import { useRouter } from 'next/router'

const Service = () => {

    const initial = {
        purpose: '',
        type_visit: 'all'
    }

    const [service, setService] = useState(initial)
    const router = useRouter()
    const {purpose, type_visit} = service

    const [visit_price, setVisitPrice] = useState([])

    const [price, setPrice] = useState(0)
    const [Id, setId] = useState('')
    const [distance, setDistance] = useState('')
    const [area, setArea] = useState('')

    const [onEdit, setOnEdit] = useState(false)
    const {id, appoint} = router.query

    const {state, dispatch} = useContext(DataContext)
    const {auth} = state

    useEffect(() => {
        setVisitPrice({Id: Id, price: price, distance: distance, area: area})
    }, [Id])

    useEffect(() => {
       if(id){
            setOnEdit(true)
            getData(`home_visit/service/${id}`).then(res => {
                setService(res.service)
                setId(res.service.visit_price[0].Id)
                setDistance(res.service.visit_price[0].distance)
                setPrice(res.service.visit_price[0].price)
                setArea(res.service.visit_price[0].area)
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

        if(!purpose || type_visit === 'all')
            return res.status(400).json({err: "Please fill all the fields"})

        dispatch({type: 'NOTIFY', payload: {loading: true}})
         
        let res;
        if(onEdit){

            res = await putData(`home_visit/service/${id}`, {purpose, type_visit, visit_price}, auth.token)
            if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})

        }else{
            
            res = await postData('home_visit/service', {appoint, purpose, type_visit, visit_price}, auth.token)
            if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})

        }

        return dispatch({type: 'NOTIFY', payload: {success: res.msg}})
    }

    const Transform = {
        backgroundColor: 'green',
        color: 'white'
    }

    const NonTransform = {
        backgroundColor: 'white',
        color: 'black'
    }

    const Home01 = () => {
        setId('hv_01')
        setPrice(3)
        setDistance('20 km')
        setArea('shadra')
    }

    const Home02 = () => {
        setId('hv_02')
        setPrice(5)
        setDistance('30 km')
        setArea('railway')
    }
    
    if(!auth.user) return null;
    return(
        <div> 
            <Head>
                <title>
                    Home Visit Service
                </title>
            </Head>

            <form className='row' onSubmit={Submit}>
                <div className='form-group'>

                    <div className='form-group input-group-prepend px-0 my-4 col-md-4 offset-md-4'>
                        <label htmlFor='type_visit' style={{fontWeight: 'bold'}}> Type Of Visit </label>
                        <select name='type_visit' value={type_visit} onChange={Handle} className="form-control text-capitalize my-2 w-100">
                            <option value='all'> All </option>
                            <option value='general'> General </option>
                            <option value='price'> Price </option>
                            <option value='emergency'> Emergency </option>
                        </select>
                    </div>

                    <div>
                        { type_visit === 'price' &&
                            <div className='my-5 table-responsive'>
                            <table className='table-bordered table-hover w-100 text-uppercase' style={{minWidth: '600px', cursor: 'pointer'}}>
                                <thead className='bg-light font-weight-bold text-center'>
                                    <tr>
                                        <td className='p-2'>ID</td>
                                        <td className='p-2'>Distance</td>
                                        <td className='p-2'>Area</td>
                                        <td className='p-2'>Price</td>                                  
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr onClick={Home01} style={Id === 'hv_01' ? Transform : NonTransform}>
                                        <td className='p-2'>hv_01</td>
                                        <td className='p-2'>20 KM</td>
                                        <td className='p-2'>Shadra</td>
                                        <td className='p-2'>$3</td>
                                    </tr>
                                    <tr onClick={Home02} style={Id === 'hv_02' ? Transform : NonTransform}>
                                        <td className='p-2'>hv_02</td>
                                        <td className='p-2'>30 KM</td>
                                        <td className='p-2'>Railway</td>
                                        <td className='p-2'>$5</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        }
                    </div>

                    <div className='form-group input-group-prepend px-0 my-4 col-md-4 offset-md-4'>
                        <label htmlFor='purpose' style={{fontWeight: 'bold'}}> Purpose </label>
                        <textarea name='purpose' id='purpose' value={purpose} placeholder="Why you want to do visit?" className="form-control d-block w-100 p-2 my-2" onChange={Handle}/>
                    </div>

                    <button type='submit' className='btn btn-primary mb-3 col-md-3 offset-md-4' style={{color: 'white'}}> {onEdit ? 'Update' : 'Submit'} </button>
                </div>
            </form>
        </div>
    )
}

export default Service