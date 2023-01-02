import Head from 'next/head'
import {useContext, useState} from 'react'
import { DataContext } from '../redux/store'
import { updateItem } from '../redux/action'
import { postData, putData } from '../utils/fetchData'

const PetType = () => {

    const {state, dispatch} = useContext(DataContext)
    const {petCategories, auth} = state

    const [name, setName] = useState('')
    const [Id, setId] = useState('')

    const createCategory = async () => {
        if(auth.user.role !== 'admin')
            return dispatch({type: 'NOTIFY', payload: {error: 'Authentication is not valid'}})

        if(!name) 
            return dispatch({type: 'NOTIFY', payload: {error: 'Name must have 1 character at least'}})

        dispatch({type: 'NOTIFY', payload: {loading: true}})

        let res;
        if(Id){

            res = await putData(`petType/${Id}`, {name}, auth.token)

            if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})
    
            dispatch(updateItem(petCategories, Id, res.petCategory, 'ADD_PETCATEGORY'))

        }else{

            res = await postData('petType', {name}, auth.token)

            if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})
    
            dispatch({type: 'ADD_PETCATEGORY', payload: [...petCategories, res.newCategory]})

        }

        setId('')
        setName('')
    
        return dispatch({type: 'NOTIFY', payload: {success: res.msg}})

    }

    const editCategory = (category) => {
       setId(category._id)
       setName(category.name)
    }

    return (
        <div className='col-md-6 mx-auto my-3'>
            <Head>
                <title> Pet Category </title>
            </Head>

            <div className='input-group mb-3'>
               <input type='text' className="form-control" placeholder="Add a new category" value={name} onChange={(props) => setName(props.target.value)}/>
               <button className='btn btn-secondary' onClick={createCategory}> {Id ? "Update" : "Create"} </button>
            </div>
                {
                    petCategories.map(item => (
                        <div key={item._id} className='card my-2 text-capatalize'>
                            <div className='card-body d-flex justify-content-between'>
                                {item.name}
                                <div style={{cursor: 'pointer'}}>
                                    <i className='fas fa-edit text-info' style={{marginRight: '10px'}} onClick={() => editCategory(item)}></i>

                                    <i className='fas fa-trash-alt text-danger' style={{marginRight: '10px'}} data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => dispatch({type: 'ADD_MODAL', payload: [{data: petCategories, id: item._id, title: item.name, type: 'ADD_PETCATEGORY'}]})}></i>
                                </div>
                            </div>
                        </div>
                    ))
                }
        </div>
    )
}

export default PetType