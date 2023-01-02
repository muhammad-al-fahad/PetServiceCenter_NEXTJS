import Head from 'next/head'
import {useContext, useState, useEffect} from 'react'
import { DataContext } from '../../redux/store'
import { Upload } from '../../utils/upload'
import { postData, putData, getData } from '../../utils/fetchData'
import { useRouter } from 'next/router'

const ManageProduct = () => {

    const initial = {
        title: "",
        price: 0,
        inStock: 0,
        description: "",
        content: "",
        categories: ""
    }

    const [product, setProduct] = useState(initial)
    const router = useRouter()
    const {title, price, inStock, description, content, categories} = product

    const [image, setImage] = useState([])
    const [onEdit, setOnEdit] = useState(false)
    const {id} = router.query

    const {state, dispatch} = useContext(DataContext)
    const {category, auth} = state

    useEffect(() => {
       if(id){
            setOnEdit(true)
            getData(`product/${id}`).then(res => {
                setProduct({...res.product, categories: res.product.category})
                setImage(res.product.images)
            })
       }else{
            setOnEdit(false)
            setProduct(initial)
            setImage([])
       }
    }, [id])

    const Handle = (props) => {
       const {name, value} = props.target
       setProduct({...product, [name]: value})
       dispatch({type: 'NOTIFY', payload: {}})
    }

    const UploadImg = (props) => {

        dispatch({type: 'NOTIFY', payload: {}})

        let newImages = []
        let num = 0

        const file = [...props.target.files]
        
        if(file.length === 0)
            return dispatch({type: 'NOTIFY', payload: {error: 'File does not exist.'}})

        file.forEach(files => {

            if(files.size > 1024*1024)
                return dispatch({type: 'NOTIFY', payload: {error: `${files.name} is ${parseFloat(files.size/1000000).toFixed(2)}MB that is over 1mb.`}}) 

            if(files.type !== 'image/jpeg' && files.type !== 'image/png' && files.type !== 'image/jpg')
                return dispatch({type: 'NOTIFY', payload: {error: `${files.name} is incorrect format!`}})
                
            num += 1;
            if(num <= 5) newImages.push(files)
            return newImages;
        })

        const count = image.length
        if(count + newImages.length > 5)
            return dispatch({type: 'NOTIFY', payload: {error: 'Only 5 images are allowed for creation of product!'}})

        setImage([...image, ...newImages])
    }

    const Delete = (index) => {
      const Img = [...image]
      Img.splice(index, 1)
      setImage(Img)
    }

    const Submit = async (props) => {
        props.preventDefault()

        if(auth.user.role !== 'admin') 
            return dispatch({type: 'NOTIFY', payload: {error: "Authentication is not valid"}})

        if(!title || !price || !inStock || !description || !content || categories === 'all' || image.length === 0)
            return dispatch({type: 'NOTIFY', payload: {error: "Please fill all the fields"}})

        dispatch({type: 'NOTIFY', payload: {loading: true}})
        
        let pictures = []

        const newURL = image.filter(img => !img.url)
        const oldURL = image.filter(img => img.url)

        if(newURL.length > 0) pictures = await Upload(newURL)
         
        let res;
        if(onEdit){

            res = await putData(`product/${id}`, {...product, image: [...oldURL, ...pictures]}, auth.token)
            if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})

        }else{
            
            res = await postData('product', {...product, image: [...oldURL, ...pictures]}, auth.token)
            if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})

        }

        return dispatch({type: 'NOTIFY', payload: {success: res.msg}})
    }
    
    if(!auth.user) return null;
    return(
        <div> 
            <Head>
                <title>
                    Manage Product
                </title>
            </Head>

            <form className='row' onSubmit={Submit}>
                <div className='form-group col-md-5 offset-md-1'>

                    <label htmlFor='title' className='mt-4'> Title </label>
                    <input type='text' name='title' id='title' value={title} placeholder="Title" className="form-control d-block w-100 p-2" onChange={Handle}/>

                    <div className='form-group row mt-4'>
                        <div className='form-group col-md-5'>
                            <label htmlFor='price'> Price </label>
                            <input type='number' name='price' id='price' value={price < 0 ? price = 0 : price} placeholder="Price" className="form-control d-block w-100 p-2" onChange={Handle}/>
                        </div>
                        <div className='form-group col-md-5 offset-md-2'>
                            <label htmlFor='inStock'> In Stock </label>
                            <input type='number' name='inStock' id='inStock' value={inStock < 0 ? inStock = 0 : inStock} placeholder="inStock" className="form-control d-block w-100 p-2" onChange={Handle}/>
                        </div>
                    </div>

                    <label htmlFor='description' className='mt-4'> Description </label>
                    <textarea name='description' id='description' cols="30" rows="4" value={description} placeholder="Description" className="form-control d-block w-100 p-2" onChange={Handle} />

                    <label htmlFor='content' className='mt-4'> Content </label>
                    <textarea name='content' id='content' cols="30" rows="6" value={content} placeholder="Content" className="form-control d-block w-100 p-2" onChange={Handle} />
                    
                    <div className='form-group input-group-prepend px-0 my-2'>
                        <label htmlFor='categories'> Category </label>
                        <select name='categories' value={categories} onChange={Handle} className="form-control text-capitalize w-100">
                            <option value='all'> All Products </option>
                            {
                                category.map(item => (
                                    <option key={item._id} value={item._id}> {item.name} </option>
                                ))
                            }
                        </select>
                    </div>
                    <button type='submit' className='btn btn-primary mb-3 col-md-3 offset-md-4' style={{color: 'white'}}> {onEdit ? 'Update' : 'Create'} </button>
                </div>

                <div className='col-md-5 offset-md-1 my-4'>
                    <div className='input-group mb-3 my-4 mx-3'>
                    <div className='input-group-prepend d-flex'>
                        <span className='input-group-text h-100'> Upload </span>
                        <input type="file" className='form-control-file' onChange={UploadImg} multiple accept='image/*' style={{opacity: 0, position: 'absolute', left: 2, top: 4, width: '13%'}}/>
                    </div>
                    <div className='form-group border rounded'>
                        <input type="file" className='form-control-file' disabled={true} multiple accept='image/*' style={{opacity: 0, left: 0}}/>
                    </div>             
                    </div>
                    <div className='row img-up mx-0'>
                        {
                           image.map((img, index) => (
                                <div key={index} className='file_img my-1'>
                                    <img src={img.url ? img.url : URL.createObjectURL(img)} alt="" className='img-thumbnail rounded'/>
                                    <span onClick={() => Delete(index)}><i className='fas fa-times'></i></span>
                                </div>
                           ))
                        }
                    </div>
                </div>
            </form>
        </div>
    )
}

export default ManageProduct