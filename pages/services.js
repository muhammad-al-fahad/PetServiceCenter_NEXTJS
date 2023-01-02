import Head from 'next/head'
import {useContext, useState, useEffect} from 'react'
import { DataContext } from '../redux/store'
import { updateItem } from '../redux/action'
import { postData, putData } from '../utils/fetchData'

const Category = () => {

    const {state, dispatch} = useContext(DataContext)
    const {services, auth} = state

    const [name, setName] = useState('')
    const [Id, setId] = useState('')

    const UpdateUser = async () => {
        if(auth.user && auth.user.role === 'doctor'){
            const res = await putData('service/doctor', {services}, auth.token)
            if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})
        }
    }

    useEffect(() => {
        UpdateUser();
    }, [services])

    const createService = async () => {
        if(auth.user.role !== 'admin')
            return dispatch({type: 'NOTIFY', payload: {error: 'Authentication is not valid'}})

        if(!name) 
            return dispatch({type: 'NOTIFY', payload: {error: 'Name must have 1 character at least'}})

        dispatch({type: 'NOTIFY', payload: {loading: true}})

        let res;
        if(Id){

            res = await putData(`service/${Id}`, {name}, auth.token)

            if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})
    
            dispatch(updateItem(services, Id, res.service, 'ADD_SERVICES'))

        }else{

            res = await postData('service', {name}, auth.token)

            if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})
    
            dispatch({type: 'ADD_SERVICES', payload: [...services, res.newService]})

        }

        setId('')
        setName('')
    
        return dispatch({type: 'NOTIFY', payload: {success: res.msg}})

    }

    const editCategory = (serve) => {
       setId(serve._id)
       setName(serve.name)
    }

    return (
        <div className='col-md-6 mx-auto my-3'>
            <Head>
                <title> Services </title>
            </Head>

            <div className='input-group mb-3'>
               <input type='text' className="form-control" placeholder="Add a new category" value={name} onChange={(props) => setName(props.target.value)}/>
               <button className='btn btn-secondary' onClick={createService}> {Id ? "Update" : "Create"} </button>
            </div>
                {
                    auth.user && auth.user.role === 'admin' && services.map(item => (
                        <div key={item._id} className='card my-2 text-capatalize'>
                            <div className='card-body d-flex justify-content-between'>
                                {item.name}
                                <div style={{cursor: 'pointer'}}>
                                    <i className='fas fa-edit text-info' style={{marginRight: '10px'}} onClick={() => editCategory(item)}></i>

                                    <i className='fas fa-trash-alt text-danger' style={{marginRight: '10px'}} data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => dispatch({type: 'ADD_MODAL', payload: [{data: services, id: item._id, title: item.name, type: 'ADD_SERVICES'}]})}></i>
                                </div>
                            </div>
                        </div>
                    ))
                }
        </div>
    )
}

export default Category