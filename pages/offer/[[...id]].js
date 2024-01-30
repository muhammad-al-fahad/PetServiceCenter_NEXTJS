import Head from 'next/head'
import React, { useState, useEffect, useContext } from 'react'
import { DataContext } from '../../redux/store'
import { Upload } from '../../utils/upload'
import { postData, putData, getData } from '../../utils/fetchData'
import { useRouter } from 'next/router'
import Items from '../../components/offer/item'
import Filter from '../../components/filter'
import filterProduct from '../../utils/filterProduct'

const CreateOffer = (props) => {

   const initial = {
      title: "",
      category: "",
      startDate: "",
      discount: 0,
      endDate: "",
   }

   const [offer, setOffer] = useState(initial)
   const {title, category, discount, startDate, endDate} = offer

   const [page, setPage] = useState(1)

   const [products, setProducts] = useState(props.products)
   const [product, setProduct] = useState([])

   const router = useRouter()

   const [duration, setDuration] = useState(0)
   const [Img, setImg ] = useState("https://res.cloudinary.com/comsats-university-lahore/image/upload/v1661425783/Rehbar%20Pet%27s%20Clinic/animals-2222007__340_dlcdyf.webp") 
   const [poster, setPoster ] = useState("") 
   const [onEdit, setOnEdit] = useState(false)
   const {id} = router.query

   const {state, dispatch} = useContext(DataContext)
   const {auth} = state

   useEffect(() => {
      setProducts(props.products)
    }, [props.products])
  
    useEffect(() => {
      if(Object.keys(router.query).length === 0){
        setPage(1)
      }
    }, [router.query])

    const loadMore = () => {
      setPage(page + 1)
      filterProduct({router, page: page + 1})
    }

   useEffect(() => {
      if(id){
         setOnEdit(true)
         getData(`offer/${id}`).then(res => {
            setOffer(res.offer)
            setImg(res.offer.poster)
            setProduct(res.offer.products)
        })
      }else{
         setOnEdit(false)
         setOffer(initial)
         setDuration(0)
      }
   }, [id])

   useEffect(() => {
      products.forEach(pro => {
         product.map(p => {
            if(pro._id === p._id) pro.checked = !pro.checked
         })
      })
      setProducts([...products])
   }, [id])

   const Check = (id) => {
      products.forEach(product => {
        if(product._id === id) product.checked = !product.checked
      })
      setProducts([...products])
    }

    useEffect(() => {
      let offer = []
      products.forEach(product => {
         if(product.checked){
            offer.push({_id: product._id})
         }
      })
      setProduct(offer)
    }, [products])

   useEffect (() => {
       const start = new Date(startDate).getTime()
       const now = new Date().getTime()

      if(start < now){
         start = now
      }

       const end = new Date(endDate).getTime()
       
       const startYear = new Date(start).getFullYear()
       const endYear = new Date(end).getFullYear()

       const startMonth = new Date(start).getMonth()
       const endMonth = new Date(end).getMonth()

       const startDay = new Date(start).getDate()
       const endDay = new Date(end).getDate()

       const monthThis = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

       if(startDay > endDay){
            endDay = endDay + monthThis[startMonth-1]
            endMonth = endMonth - 1
       }

       if(startMonth > endMonth){
           endYear = endYear - 1
           endMonth= endMonth + 12
       }

       const finalYear = endYear - startYear
       const finalMonth = endMonth - startMonth
       const finalDay = endDay - startDay
       
       if(finalYear < 0 || finalMonth < 0 || finalDay < 0 || (startYear === endYear && startMonth === endMonth && startDay === endDay)) return setDuration(0)

       if(!endDate) return setDuration(0)
       if(finalYear) return setDuration(finalYear + " Years  " + finalMonth + " Months  " + finalDay + " Days")
       if(finalMonth) return setDuration(finalMonth + " Months  " + finalDay + " Days")
       if(finalDay) return setDuration(finalDay + " Days")

   }, [startDate, Date.now, endDate])

   const Handle = (props) => {
      const {name, value} = props.target
      setOffer({...offer, [name]: value})
      dispatch({type: 'NOTIFY', payload: {}})
   }

   const UploadImg = (props) => {
      const file = props.target.files[0]

        if(!file) 
            return dispatch({ type: 'NOTIFY', payload: {error: "File does not exist!"}})

        if(file.size > 1024*250*10)
            return dispatch({type: 'NOTIFY', payload: {error: `${file.name} is ${parseFloat(file.size/1000000).toFixed(2)}MB that is over 1024*250 size.`}}) 

        if(file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/jpg' && file.type !== 'image/webp')
            return dispatch({type: 'NOTIFY', payload: {error: `${file.name} is incorrect format!`}})

        setPoster(file)
   }

   const Submit = async (props) => {
      props.preventDefault()

      if(auth.user.role !== 'admin') 
            return dispatch({type: 'NOTIFY', payload: {error: "Authentication is not valid"}})

      if(category === 'all' || duration === 0 || !title || !startDate || !endDate || discount === 0 || discount > 100 || product.length === 0)
         return dispatch({type: 'NOTIFY', payload: {error: "Please fill all the fields"}})
      
      if(!id && poster.length === 0) return dispatch({type: 'NOTIFY', payload: {error: "Apply Poster/Image"}})

      dispatch({type: 'NOTIFY', payload: {loading: true}})
        
      let pictures;

      if(poster) pictures = await Upload([poster])

      let res;

      if(onEdit){

         res = await putData(`offer/${id}`, {...offer, poster: poster ? pictures[0].url : Img, duration, discount, product}, auth.token)
         if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})
         dispatch({type: 'NOTIFY', payload: {success: res.msg}})
         return router.push(`/offer/${id}`)

      }else {

         res = await postData('offer', {...offer, poster: poster ? pictures[0].url : Img, duration, discount, product}, auth.token)
         if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})
         dispatch({type: 'NOTIFY', payload: {success: res.msg}})
         return router.push('/offer')
      }
   }

   if(auth.user && auth.user.role !== 'admin') return null
   return(
    <div>
      <Head>
         <title> {id ? "Update Offer" : "Create Offer"} </title>
      </Head>
      <form className='my-4 col-12' onSubmit={Submit}>
         <div className='form-group col-12'>

            <div className='input-group col-md-5 offset-md-3 mb-3 my-4 d-flex'>
                  <div className='input-group-prepend d-flex'>
                        <span className='input-group-text h-100'> Upload </span>
                        <input type="file" className='form-control-file' onChange={UploadImg} accept='image/*' style={{opacity: 0, position: 'absolute', left: 2, top: 4, width: '13%'}}/>
                  </div>

                  <div className='form-group border rounded'>
                  <input type="file" className='form-control-file' disabled={true} accept='image/*' style={{opacity: 0, left: 0}}/>
                  </div>             
            </div>

            <div className='col-md-5 offset-md-3'>
               <img src={poster ? URL.createObjectURL(poster) : Img} alt="Offer Poster" width='100%' height='75%' className='img-thumbnail rounded'/>
            </div>

            <div className='form-group input-group-prepend col-md-5 offset-md-3 px-0 my-2'>
               <label htmlFor='title' style={{fontWeight: 'bold'}}> Title </label>
               <input type='text' name='title' id='title' value={title} className="form-control text-capitalize mt-4 w-100" onChange={Handle}/>
            </div>

            <div className='form-group input-group-prepend col-md-5 offset-md-3 px-0 my-2'>
               <label htmlFor='category' style={{fontWeight: 'bold'}}> Category </label>
               <select name='category' id='category' value={category} onChange={Handle} className="form-control text-capitalize mt-4 w-100">
                  <option value='all'> All Offers </option>
                  <option value='basic'> Basic Offer </option>
                  <option value='standard'> Standard Offer </option>
                  <option value='premium'> Premium Offer </option>
               </select>
            </div>

            <div className="form-group col-md-5 offset-md-3 my-4">
               <label htmlFor="startDate" style={{fontWeight: 'bold'}}> Start Date </label>
               <input type="date" id="startDate" className="form-control my-2" placeholder="Enter Start Date" name='startDate' value={startDate} onChange={Handle}/>

               <h6 className='my-4'>Duration:- {duration}</h6>

               <label htmlFor="endDate" style={{fontWeight: 'bold'}}> End Date </label>
               <input type="date" id="endDate" className="form-control my-2" placeholder="Enter End Date" name='endDate' value={endDate} onChange={Handle}/>
            </div>

            <div className="form-group col-md-5 offset-md-3 my-4">
               <label htmlFor="discount" style={{fontWeight: 'bold'}}> Discount </label>
               <input type="number" id="discount" className="form-control my-2" name='discount' value={discount} onChange={Handle}/>
            </div>

            <Filter state={state}/>
            <em style={{color: 'crimson', marginLeft: '425px'}}>* Those products are become discounted which are to be checked *</em>
            <div className = "product">
            {
               products.length === 0 ?
               <h2> No Products </h2> :
               products.map(product_01 => (
                  <Items key={product_01._id} product={product_01} Check={Check} id={id ? id : ''}/>
               ))
            }
            </div>
            {
               props.result < page * 8 ? ""
               : <button className='btn btn-outline-info d-block mx-auto mb-4' onClick={loadMore}> Load More </button>
            }

            <button type='submit' className='btn btn-info col-md-5 offset-md-3 my-4' style={{color: 'white'}}> {id ? 'Update' : 'Create'} </button>

         </div>
      </form>
    </div>
   )
}


export async function getServerSideProps({query}) {

   const page = query.page || 1
   const category = query.category || 'all'
   const sort = query.sort || ''
   const search = query.search || 'all'
 
   const res = await getData(`product?limit=${page*8}&category=${category}&sort=${sort}&title=${search}`)
   // Server Side Rendering
     return{
       props: {
         products: res.product,
         result: res.result
       }, // will be passed to the page component as props
     }
 }

export default CreateOffer