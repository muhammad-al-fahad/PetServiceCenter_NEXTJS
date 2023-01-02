import Head from 'next/head'
import { useState, useContext } from 'react'
import { getData } from '../../utils/fetchData'
import { DataContext } from '../../redux/store'
import { addToCart } from '../../redux/action'

const DetailProduct = (props) => {
     const [product, setProduct] = useState(props.product)

     const [tab, setTab] = useState(0)

     const {state, dispatch} = useContext(DataContext)
     const { offers, cart, auth } = state

    const isActive = (index) => {
      if(tab === index) return "active";
      return ""
    }

    if(!auth.user) return null
    return (
        <div className='row detail_page justify-content-center'>
            <Head>
                <title>
                    Detail Product
                </title>
            </Head>
            <div className='col-md-4 mx-3'>
                <img src={product.images[tab].url} alt={product.images[tab].url} className="d-block img-thumbnail rounded mt-4 w-100" style={{height: '350px'}}/>
                <div className='row mx-0' style={{cursor: 'pointer'}}>
                  {product.images.map((img, index) => (
                        <img key={index} src={img.url} alt={img.url} className={`img-thumbnail rounded ${isActive(index)}`} style={{height: '80px', width: '20%'}} onClick = {() => setTab(index)} />
                  ))}
                </div>
            </div>

            <div className='col-md-4 mt-3 mx-3'>
              <h2 className='text-uppercase'>{product.title}</h2>
              {
                offers.map(off => (
                  off.products.map(discount => (
                    auth.user && auth.user.role === 'membership' && auth.user.membership === off.category && off.duration !== "0" && product._id === discount._id &&
                    <h6><del className="text-danger" style={{flex:1}}> ${product.price}</del></h6>
                  ))
                ))
              }
              {
                offers.map(off => (
                    off.products.map(discount => (
                        auth.user && auth.user.role === 'membership' && auth.user.membership === off.category && off.duration !== "0" && product._id === discount._id &&
                        <h6 className="text-danger" style={{flex:1}}> ${product.price - (product.price*off.discount)/100}</h6>
                    ))
                ))
              }
              {
                offers.map(off => (
                      auth.user && auth.user.role === 'membership' && auth.user.membership === off.category && off.duration === "0" &&
                      <h6 className="text-danger" style={{flex:1}}> ${product.price}</h6>
                ))
              }
              <div className='row d-flex justify-content-between'>
                {
                  product.inStock > 0
                  ? <h6 className='text-danger' style={{flex: 1}}>In Stock: {product.inStock}</h6>
                  : <h6 className='text-danger' style={{flex: 1}}>Out of Stock</h6>
                }

                 <h6 className='text-danger' style={{flex: 1}}>Sold: {product.sold}</h6>
              </div>
              <div className='my-2'>{product.description}</div>
              <div className='my-2'>{product.content}</div>
              <div>
              <button className='btn btn-success' style={{marginLeft: '5px', flex: 1}} disabled={product.inStock === 0 ? true : false} onClick={() => dispatch(addToCart(product, cart))}> Buy </button>
              </div>
            </div>
        </div>
    )
}

export async function getServerSideProps({params: {id}}) {
    const res = await getData(`product/${id}`)
    // Server Side Rendering
      return{
        props: {
          product: res.product
        }, // will be passed to the page component as props
      }
  }

export default DetailProduct