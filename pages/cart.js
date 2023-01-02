import Head from 'next/head'
import { useContext, useState, useEffect } from 'react'
import { DataContext } from '../redux/store'
import Item from '../components/item'
import Link from 'next/link'
import { getData, postData } from '../utils/fetchData'
import { useRouter } from 'next/router'


const Cart = () => {

  const {state , dispatch} = useContext(DataContext)
  const { cart, auth, orders } = state

  const [total, setTotal] = useState(0)

  const [address, setAddress] = useState('')
  const [number, setNumber] = useState('')
  const [callback, setCallback] = useState(false)

  const router = useRouter()

  useEffect(() => {
    if(auth.user){
      setAddress(auth.user.address)
      setNumber(auth.user.contact)
    }   
    }, [auth.user])

  const Payment = async () => {
    if(!address || !number){
      return dispatch({type: 'NOTIFY', payload: {error: "Please Fill Your Shipping Form!"}})
    } else if(!auth.user){
      return dispatch({type: 'NOTIFY', payload: {error: "Please Login!"}})
    }

    let newCart = []
    for(const item of cart){
      const res = await getData(`product/${item._id}`)
      if(res.product.inStock - item.quantity >= 0){
        newCart.push(item)
      }
    }

    if(newCart.length < cart.length){
      setCallback(!callback)
      return dispatch({type: 'NOTIFY', payload: {error: "The quantity value is insufficient!"}})
    }

    dispatch({type: 'NOTIFY', payload: {loading: true}})

    postData('order/orders', { address, number, cart, total }, auth.token).then(res => {
      if(res.err) return dispatch({ type: 'NOTIFY', payload: {error: res.err}})
      dispatch({ type: 'ADD_CART', payload: []})

      const newOrder = {
        ...res.newOrder,
        user: auth.user
      }
      
      dispatch({ type: 'ADD_ORDER', payload: [...orders, newOrder]})
      dispatch({ type: 'NOTIFY', payload: {success: res.msg}})
      return router.push(`/order/${res.newOrder._id}`)
    }) 
  }

  const getTotal = () => {
    const res = cart.reduce((prev, item) => {
        return prev + (item.price * item.quantity)
    }, 0)
    setTotal(res)
  }

  const updateCart = async (req, resp) => {
    for(const item of req){
       const res = await getData(`product/${item._id}`)
       const {_id, title, images, inStock, membership, price, discount, sold} = res.product

        if(inStock > 0){
            resp.push({_id, title, images, inStock, price: auth.user.role === 'membership' && auth.user.membership === membership ? discount : price, sold, quantity: item.quantity > inStock ? 1 : item.quantity})
        }
    }
    dispatch({type: 'ADD_CART', payload: resp})
  }

  useEffect(() => {
    getTotal();
  },[cart])

  useEffect(() => {
     const Viewcart = JSON.parse(localStorage.getItem('_cart_accessories_pet'))
     if(Viewcart && Viewcart.length > 0){
      let newArr = []
      updateCart(Viewcart, newArr);
     }
  },[callback])

  if(!auth.user) return null;
  if(cart.length === 0) return <img className='img-responsive w-100' src='/empty_cart.jpg' alt='not empty'/>
  return(
      <div className='row mx-auto'>
        <Head>
          <title> Cart </title>
        </Head>
        <div className='col-md-8 text-right text-secondary table-responsive my-3'>
          <h2 className='text-uppercase'> Shopping Cart </h2>
          <table className='table my-3'>
            <tbody>
              {
                cart.map(item => (
                  <Item key={item._id} item={item} dispatch={dispatch} cart={cart}/>
                ))
              }
            </tbody>
          </table>
        </div>
        <div className='col-md-4 my-3 text-uppercase text-secondary' style={{textAlign: 'right'}}>
          <form>
            <h2> Shipping Form </h2>
            <label htmlFor='address'> Address </label>
            <input type='text' name='address' id='address' className='form-control mb-2' placeholder='Enter Your Home Location' value={address} disabled={true}/>

            <label htmlFor='mobile'> Mobile </label>
            <input type='numeric' name='mobile' id='mobile' className='form-control mb-2' placeholder='Enter Your Mobile Number' value={number} disabled={true}/>
          </form>
          <h3>
            Total: <span className='text-danger'>${total}</span>
          </h3>
              <Link href={!address || !number ? '#' : !auth.user ? '/login' : '#'}>
                <a className='btn btn-dark my-2' onClick={Payment}> Proceed with Payment </a>
              </Link>
          
        </div>
      </div>
  )
}
  
export default Cart