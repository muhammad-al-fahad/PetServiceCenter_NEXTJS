import Head from 'next/head'
import {useContext, useState, useEffect} from 'react'
import { DataContext } from '../redux/store'
import { updateItem } from '../redux/action'
import { postData, putData } from '../utils/fetchData'

const Timing = () => {

    const {state, dispatch} = useContext(DataContext)
    const {timings, auth} = state

    const [name, setName] = useState('')
    const [Id, setId] = useState('')

    const createTiming = async () => {
        if(auth.user.role !== 'admin')
            return dispatch({type: 'NOTIFY', payload: {error: 'Authentication is not valid'}})

        if(!name) 
            return dispatch({type: 'NOTIFY', payload: {error: 'Name must have 1 character at least'}})

        dispatch({type: 'NOTIFY', payload: {loading: true}})

        let res;
        if(Id){

            res = await putData(`timing/${Id}`, {name}, auth.token)

            if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})
    
            dispatch(updateItem(timings, Id, res.timing, 'ADD_TIMING'))

        }else{

            res = await postData('timing', {name}, auth.token)

            if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})
    
            dispatch({type: 'ADD_TIMING', payload: [...timings, res.newTiming]})

        }

        setId('')
        setName('')
    
        return dispatch({type: 'NOTIFY', payload: {success: res.msg}})

    }

    const editCategory = (time) => {
       setId(time._id)
       setName(time.name)
    }

    return (
        <div className='col-md-6 mx-auto my-3'>
            <Head>
                <title> Timing </title>
            </Head>

            <div className='input-group mb-3'>
               <input type='text' className="form-control" placeholder="Add a new category" value={name} onChange={(props) => setName(props.target.value)}/>
               <button className='btn btn-secondary' onClick={createTiming}> {Id ? "Update" : "Create"} </button>
            </div>
                {
                    auth.user && auth.user.role === 'admin' && timings.map(time => (
                        <div key={time._id} className='card my-2 text-capatalize'>
                            <div className='card-body d-flex justify-content-between'>
                                {time.name}
                                <div style={{cursor: 'pointer'}}>
                                    <i className='fas fa-edit text-info' style={{marginRight: '10px'}} onClick={() => editCategory(time)}></i>

                                    <i className='fas fa-trash-alt text-danger' style={{marginRight: '10px'}} data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => dispatch({type: 'ADD_MODAL', payload: [{data: timings, id: time._id, title: time.name, type: 'ADD_TIMING'}]})}></i>
                                </div>
                            </div>
                        </div>
                    ))
                }
        </div>
    )
}

export default Timing