import Head from 'next/head'
import React, { useState, useEffect, useContext } from 'react'
import { DataContext } from '../../redux/store'
import { Upload } from '../../utils/upload'
import { postData, putData, getData } from '../../utils/fetchData'
import { useRouter } from 'next/router'

const CreatePet = () => {

   const initial = {
      petName: "",
      petCategory: "",
      dateofbirth: "",
      petSex: "",
      bio: "",
      disease: ""
   }

   const [userPet, setUserPet] = useState(initial)
   const {petName, petCategory, dateofbirth, petSex, bio, disease} = userPet

   const router = useRouter()

   const [age, setAge] = useState(0)
   const [avatar, setAvatar] = useState([])

   const [show, setShow] = useState(false)
   const [petDisease, setPetDisease] = useState(false)

   const [onEdit, setOnEdit] = useState(false)
   const {id} = router.query

   const [isMale, setIsMale] = useState(false)
   const [isFemale, setIsFemale] = useState(false)

   const {state, dispatch} = useContext(DataContext)
   const {petCategories, auth} = state

   useEffect(() => {
      if(id){
         setOnEdit(true)
         getData(`pet/${id}`).then(res => {
            setUserPet({...res.pet, petCategory: res.pet.petCategory})
            setAvatar(res.pet.images)
            setIsFemale(res.pet.petSex === 'Female' ? true : false)
            setIsMale(res.pet.petSex === 'Male' ? true : false)
        })
      }else{
         setOnEdit(false)
         setUserPet(initial)
         setAvatar([])
         setAge(0)
      }
   }, [id])

   useEffect(() => {
     if(disease.length !== 0){
      setShow(true)
      setPetDisease(true)
     }
   }, [disease])

   useEffect (() => {
       const present = new Date().getTime()
       const past = new Date(dateofbirth).getTime()
       
       const forwardYear = new Date(present).getFullYear()
       const backwardYear = new Date(past).getFullYear()

       const forwardMonth = new Date(present).getMonth()
       const backwardMonth = new Date(past).getMonth()

       const forwardDay = new Date(present).getDate()
       const backwardDay = new Date(past).getDate()

       const monthThis = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

       if(backwardDay > forwardDay){
           forwardDay = forwardDay + monthThis[backwardMonth-1]
           forwardMonth = forwardMonth - 1
       }

       if(backwardMonth > forwardMonth){
           forwardYear = forwardYear - 1
           forwardMonth = forwardMonth + 12
       }

       const finalYear = forwardYear - backwardYear
       const finalMonth = forwardMonth - backwardMonth
       const finalDay = forwardDay - backwardDay
       
       if(finalYear < 0 || finalMonth < 0 || finalDay < 0 || (forwardYear === backwardYear && forwardMonth === backwardMonth && forwardDay === backwardDay)) return setAge(0)
       if(!dateofbirth) return setAge(0)
       if(finalYear) return setAge(`${finalYear} Years  ${finalMonth} Months  ${finalDay} Days`)
       if(finalMonth) return setAge(`${finalMonth} Months  ${finalDay} Days`)
       if(finalDay) return setAge(`${finalDay} Days`)

   }, [dateofbirth, Date.now])

   const Handle = (props) => {
      const {name, value} = props.target
      setUserPet({...userPet, [name]: value})
      dispatch({type: 'NOTIFY', payload: {}})
   }

   const EditMale = () => {
      if(!isMale){
         setIsMale(!isMale)
         setIsFemale(false)
      }
   }

   const EditFemale = () => {
      if(!isFemale){
         setIsFemale(!isFemale)
         setIsMale(false)
      }
   }

   const UploadImg = (props) => {
      const file = [...props.target.files]

      const newImg = []
      const num = 0

      if(file.length === 0) 
          return dispatch({ type: 'NOTIFY', payload: {error: "File does not exist!"}})

      file.forEach(files => {
         
         if(files.size > 1024*1024)
            return dispatch({type: 'NOTIFY', payload: {error: `${files.name} is ${parseFloat(files.size/1000000).toFixed(2)}MB that is over 1mb.`}}) 

         if(files.type !== 'image/jpeg' && files.type !== 'image/png' && files.type !== 'image/jpg')
            return dispatch({type: 'NOTIFY', payload: {error: `${files.name} is incorrect format!`}})

         num += 1

         if(num < 6) newImg.push(files)
         return newImg
      })

      const count = avatar.length
        if(count + newImg.length > 6)
            return dispatch({type: 'NOTIFY', payload: {error: 'Only 6 images are allowed for creation of product!'}})

      setAvatar([...avatar, ...newImg])
   }

   const Delete = (index) => {
      const Img = [...avatar]
      Img.splice(index, 1)
      setAvatar(Img)
   }

   const Disease = () => {
      setShow(true)
      setPetDisease(true)
   }

   const transForm = {
      visibility: show ? "hidden" : "flex",
      display: show ? "none" : "flex"
    } 

   const Submit = async (props) => {
      props.preventDefault()

      petSex = isMale ? 'Male' : isFemale ? 'Female' : ''

      if(!petName || petCategory === 'all' || petSex === '' || age === 0 || !dateofbirth || avatar.length === 0)
         return dispatch({type: 'NOTIFY', payload: {error: "Please fill all the fields"}})

      dispatch({type: 'NOTIFY', payload: {loading: true}})
        
      let pictures = []

      const newURL = avatar.filter(img => !img.url)
      const oldURL = avatar.filter(img => img.url)

      if(newURL.length > 0) pictures = await Upload(newURL)

      let res;

      if(onEdit){

         res = await putData(`pet/${id}`, {...userPet, avatar: [...oldURL, ...pictures], age, petSex}, auth.token)
         if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})
         dispatch({type: 'NOTIFY', payload: {success: res.msg}})
         return router.push(`/pet/${id}`)

      }else {

         res = await postData('pet', {...userPet, avatar: [...oldURL, ...pictures], age, petSex}, auth.token)
         if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})
         dispatch({type: 'NOTIFY', payload: {success: res.msg}})
         return router.push('/pet')
      }
   }

   if(!auth.user) return null;
   return(
    <div>
      <Head>
         <title> Add Pet </title>
      </Head>
      <form className='col-md-5 offset-md-3 my-4' onSubmit={Submit}>
         <div className='form-group'>

            <label htmlFor='petName' className='mt-4' style={{fontWeight: 'bold'}}> PetName </label>
            <input type='text' name='petName' id='petName' value={petName} placeholder="Enter Pet Name" className="form-control d-block w-100 p-2 my-2" onChange={Handle}/>
            
            <label htmlFor='sex' className='my-4' style={{fontWeight: 'bold'}}> PetSex </label>
            <div className='form-group d-flex my-0'>
               <div className='custom-control custom-checkbox d-flex'>
                     <input type='checkbox' name='male' id='male' checked={isMale} className="custom-control-input d-block p-2" style={{width: '20px', height: '20px', marginTop: '-2px'}} onChange={EditMale}/>
                     <label className='custom-control-label mb-4' htmlFor='male' style={{transform: 'translate(4px, -3px)', marginRight: '10px'}}> Male </label>
               </div>
               <div className='custom-control custom-checkbox d-flex' style={{marginLeft: '25%'}}>
                     <input type='checkbox' name='female' id='female' checked={isFemale} className="custom-control-input d-block p-2" style={{width: '20px', height: '20px', marginTop: '-2px'}} onChange={EditFemale}/>
                     <label className='custom-control-label mb-4' htmlFor='female' style={{transform: 'translate(4px, -3px)', marginRight: '10px'}}> Female </label>
               </div>
            </div>

            <div className='form-group my-4'>
               <label htmlFor="bio" style={{fontWeight: 'bold'}}> Bio </label>
               <textarea id="bio" className="form-control my-2" cols='30' rows='4' placeholder="Enter Your Pet's Bio" name='bio' value={bio} onChange={Handle}/>
            </div>
            {
               !show &&
               <div className='d-flex' style={transForm}> 
                  <p className='text-secondary'>Does your pet have any disease / issues ? </p>
                  <button type='button' className='mx-4 bg-white' style={{border: '1px inset green', width: '70px', height: '30px', borderRadius: '20px'}} onClick={Disease}><i className='fas fa-check text-success'></i> Yes</button>
                  <button type='button' className='mx-4 bg-white' style={{border: '1px inset red', width: '70px', height: '30px', borderRadius: '20px'}} onClick = {() => setShow(true)}><i className='fas fa-times text-danger'></i> No</button>
               </div>
            }
            {
               petDisease &&
               <div className='form-group my-4'>
                  <label htmlFor="disease" style={{fontWeight: 'bold'}}> Disease </label>
                  <textarea id="disease" className="form-control my-2" cols='30' rows='4' placeholder="Enter Your Pet's Disease" name='disease' value={disease} onChange={Handle}/>
               </div>
            }

            <div className='form-group input-group-prepend px-0 my-2'>
               <label htmlFor='petCategory' style={{fontWeight: 'bold'}}> PetCategory </label>
               <select name='petCategory' value={petCategory} onChange={Handle} className="form-control text-capitalize mt-4 w-100">
                  <option value='all'> All Pets </option>
                  {
                     petCategories.map(pet => (
                        <option key={pet._id} value={pet._id}> {pet.name} </option>
                     ))
                  }
               </select>
            </div>

            <div className="form-group my-4">
               <label htmlFor="dateofbirth" style={{fontWeight: 'bold'}}> Date of Birth</label>
               <input type="date" id="dateofbirth" className="form-control my-2" placeholder="Enter Your Pet Date of Birth" name='dateofbirth' value={dateofbirth} onChange={Handle}/>
               <h6>Age:- {age}</h6>
            </div>

            <div className='input-group mb-3 my-4 d-flex'>
               <div className='input-group-prepend d-flex'>
                     <span className='input-group-text h-100'> Upload </span>
                     <input type="file" className='form-control-file' onChange={UploadImg} multiple accept='image/*' style={{opacity: 0, position: 'absolute', left: 2, top: 4, width: '13%'}}/>
               </div>
               <div className='form-group border rounded'>
               <input type="file" className='form-control-file' disabled={true} multiple accept='image/*' style={{opacity: 0, left: 0}}/>
               </div>             
            </div>
            <div className='row img-down w-100 mx-5'>
               {
                  avatar.map((img, index) => (
                        <div key={index} className='img my-2'>
                           <img src={img.url ? img.url : URL.createObjectURL(img)} alt="" className='img-thumbnail rounded'/>
                           <span onClick={() => Delete(index)}><i className='fas fa-times'></i></span>
                        </div>
                  ))
               }
            </div>

            <button type='submit' className='btn btn-info my-4 w-50' style={{color: 'white', marginLeft: 120}}> {id ? 'Update Pet' : 'Add Pet'} </button>
         </div>
      </form>
    </div>
   )
}

export default CreatePet