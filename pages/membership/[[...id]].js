import Head from 'next/head'
import React, { useState, useEffect, useContext } from 'react'
import { DataContext } from '../../redux/store'
import { Upload } from '../../utils/upload'
import { postData, putData, getData } from '../../utils/fetchData'
import { useRouter } from 'next/router'

const Membership = () => {

   const initial = {
      title: "",
      category: "",
      description: "",
      price: 0,
      day: ""
   }

   const [membership, setMembership] = useState(initial)
   const {title, category, description, price, day} = membership

   const router = useRouter()

   const [Img, setImg ] = useState("https://res.cloudinary.com/comsats-university-lahore/image/upload/v1661623204/Rehbar%20Pet%27s%20Clinic/membership-icon-participation-185439420-removebg-preview_m99u3e.png") 
   const [image, setImage ] = useState("")

   const [name, setName] = useState('') 

   const [type, setType] = useState([])
   const [onEdit, setOnEdit] = useState(false)
   const {id} = router.query
   
   const {state, dispatch} = useContext(DataContext)
   const {auth, types} = state

   useEffect(() => {
      setType(types)
   }, [types])

   useEffect(() => {
      if(id){
         setOnEdit(true)
         getData(`membership/${id}`).then(res => {
            setMembership(res.member)
            setImg(res.member.image)
            dispatch({type: 'ADD_TYPES', payload: res.member.types})
      })
      }else{

         setOnEdit(false)
         setMembership(initial)
         setImg('https://res.cloudinary.com/comsats-university-lahore/image/upload/v1661623204/Rehbar%20Pet%27s%20Clinic/membership-icon-participation-185439420-removebg-preview_m99u3e.png')
         setType([])
         dispatch({type: 'ADD_TYPES', payload: []})

      }
   }, [id])

   const Handle = (props) => {
      const {name, value} = props.target
      setMembership({...membership, [name]: value})
      dispatch({type: 'NOTIFY', payload: {}})
   }

   const UploadImg = (props) => {
      const file = props.target.files[0]

        if(!file) 
            return dispatch({ type: 'NOTIFY', payload: {error: "File does not exist!"}})

        if(file.size > 1024*1024)
            return dispatch({type: 'NOTIFY', payload: {error: `${file.name} is over 250*250 pixel.`}}) 

        if(file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/jpg' && file.type !== 'image/webp')
            return dispatch({type: 'NOTIFY', payload: {error: `${file.name} is incorrect format!`}})

        setImage(file)
   }

   const Submit = async (props) => {
      props.preventDefault()

      if(auth.user.role !== 'admin') 
            return dispatch({type: 'NOTIFY', payload: {error: "Authentication is not valid"}})

      if(!title || category === 'all' || day === 'all' || description === '' || price === 0)
         return dispatch({type: 'NOTIFY', payload: {error: "Please fill all the fields"}})

      dispatch({type: 'NOTIFY', payload: {loading: true}})
        
      let pictures;

      if(image) pictures = await Upload([image])

      let res;

      if(onEdit){

         res = await putData(`membership/${id}`, {...membership, image: image ? pictures[0].url : Img, price, types: type}, auth.token)
         if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})
         dispatch({type: 'NOTIFY', payload: {success: res.msg}})
         router.push(`/membership/${id}`)

      }else {
         if(image.length === 0)
            return dispatch({type: 'NOTIFY', payload: {error: "Please upload the offer poster"}})

         if(types.length === 0)
            return dispatch({type: 'NOTIFY', payload: {error: "Please Write One Type"}})

         res = await postData('membership', {...membership, image: image ? pictures[0].url : Img, price, types: type}, auth.token)
         if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})
         dispatch({type: 'NOTIFY', payload: {success: res.msg}})

         router.push('/membership')

         setMembership(initial)
         setImg('https://res.cloudinary.com/comsats-university-lahore/image/upload/v1661623204/Rehbar%20Pet%27s%20Clinic/membership-icon-participation-185439420-removebg-preview_m99u3e.png')
         setType([])
         dispatch({type: 'ADD_TYPES', payload: []})

      }
   }

   const CreateType = async () => {

      if(auth.user.role !== 'admin')
         return dispatch({type: 'NOTIFY', payload: {error: 'Authentication is not valid'}})

      if(!name) 
         return dispatch({type: 'NOTIFY', payload: {error: 'Name must have 1 character at least'}})

      dispatch({type: 'NOTIFY', payload: {loading: true}})   

      const res = await postData('membership/types', {name}, auth.token)

      if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})

      dispatch({type: 'ADD_TYPES', payload: [...types, res.newType]})

      setName('')

      return dispatch({type: 'NOTIFY', payload: {success: res.msg}})
   }

   if(auth.user && auth.user.role !== 'admin') return null
   return(
    <div>
      <Head>
         <title> {id ? "Update Membership" : "Create Membership"} </title>
      </Head>
      <form className='col-md-5 offset-md-3 my-4' onSubmit={Submit}>
         <div className='form-group'>

         <div className='input-group mb-3 my-4 d-flex'>
               <div className='input-group-prepend d-flex'>
                     <span className='input-group-text h-100'> Upload </span>
                     <input type="file" className='form-control-file' onChange={UploadImg} accept='image/*' style={{opacity: 0, position: 'absolute', left: 2, top: 4, width: '13%'}}/>
               </div>
               <div className='form-group border rounded'>
               <input type="file" className='form-control-file' disabled={true} accept='image/*' style={{opacity: 0, left: 0}}/>
               </div>             
            </div>
            <div className='w-100 mx-0'>
               <img src={image ? URL.createObjectURL(image) : Img} alt="Offer Poster" width='100%' height='75%' className='img-thumbnail rounded'/>
            </div>

            <label htmlFor='title' className='mt-4' style={{fontWeight: 'bold'}}> Title </label>
            <input type='text' name='title' id='title' value={title} placeholder="Enter Offer Title" className="form-control d-block w-100 p-2 my-2" onChange={Handle}/>

            <div className='form-group my-4'>
               <label htmlFor="description" style={{fontWeight: 'bold'}}> Description </label>
               <textarea id="description" className="form-control my-2" cols='20' rows='2' placeholder="Enter Description" name='description' value={description} onChange={Handle}/>
            </div>

            <div className='form-group input-group-prepend px-0 my-2'>
               <label htmlFor='category' style={{fontWeight: 'bold'}}> Category </label>
               <select name='category' id='category' value={category} onChange={Handle} className="form-control text-capitalize mt-4 w-100">
                  <option value='all'> All Membership </option>
                  <option value='basic'> Basic Membership </option>
                  <option value='standard'> Standard Membership </option>
                  <option value='premium'> Premium Membership </option>
               </select>
            </div>

            <div className="form-group my-4">
               <label htmlFor="price" style={{fontWeight: 'bold'}}> Price:- </label>
               <div className='mx-2 d-flex my-4 mx-0' style={{marginTop: '-2px'}}><h5 style={{marginTop: '4px'}}>$</h5> <input type="number" id="price" className="form-control mx-2" style={{marginTop: '-3px'}} placeholder="0" name='price' value={price < 0 ? price = 0 : price} onChange={Handle}/>/
                  <select name='day' id='day' value={day} onChange={Handle} className="form-control text-capitalize mx-2">
                     <option value='all'> All </option>
                     <option value='Month'> Month </option>
                     <option value='6 Months'> 6 Months </option>
                     <option value='Year'> Year </option>
                  </select>
               </div>
            </div>

            <label htmlFor="types" style={{fontWeight: 'bold'}}> Types </label>
            <div className='form-group my-2 d-flex'>
               <input type='text' className="form-control" placeholder="Add a new Type" value={name} onChange={(props) => setName(props.target.value)}/>
               <button type='button' className='btn btn-secondary' onClick={CreateType}> Create </button>
            </div>

            {
                    type.map(item => (
                        <div key={item._id} className='card my-2 text-capatalize'>
                            <div className='card-body d-flex justify-content-between'>
                                {item.name}
                                <div style={{cursor: 'pointer'}}>
                                    <i className='fas fa-trash-alt text-danger' style={{marginRight: '10px'}} data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => dispatch({type: 'ADD_MODAL', payload: [{data: types, id: item._id, title: item.name, type: 'ADD_TYPES'}]})}></i>
                                </div>
                            </div>
                        </div>
                    ))
                }

            <button type='submit' className='btn btn-info my-4 w-50' style={{color: 'white', marginLeft: 120}}> {id ? 'Update' : 'Create'} </button>
         </div>
      </form>
    </div>
   )
}

export default Membership