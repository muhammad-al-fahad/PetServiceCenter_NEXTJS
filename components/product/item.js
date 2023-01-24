import Link from 'next/link'
import { useContext, useState, useEffect } from 'react'
import { DataContext } from '../../redux/store'
import { addToCart } from '../../redux/action'

const Items = ({product, validate, Check}) => {

    const {state, dispatch} = useContext(DataContext)
    const {offers, cart, auth} = state
    const [products, setProducts] = useState([])
    const [valid, setValid] = useState([])

    useEffect(() => {
     let prod = []
     offers.map(off => {
        off.products.map(pro => {prod.push(pro._id)})
     })
     setProducts(prod)
    }, [offers, product])

    useEffect(() => {
        const abc = validate.filter(v => !products.includes(v._id))
        setValid(abc)
    }, [products])

    const userLink = () => {
        return(
            <>
                <Link href={`product/${product._id}`}>
                    <a className='btn btn-info' style={{marginLeft: '5px', flex: 1}}>View</a>
                </Link>
                <button className='btn btn-success' style={{marginLeft: '5px', flex: 1}} disabled={product.inStock === 0 ? true : false} onClick={() => dispatch(addToCart(product, cart))}> Buy </button>
            </>
        )
    }
    
    const adminLink = () => {
        return(
            <>
                <Link href={`/create/${product._id}`}>
                    <a className='btn btn-info' style={{marginRight: '5px', flex: 1}}> Edit </a>
                </Link>
                <button className='btn btn-danger' style={{marginLeft: '5px', flex: 1}} data-bs-toggle="modal" data-bs-target="#exampleModal" onClick = {() => dispatch({type: 'ADD_MODAL', payload: [{data: '', id: product._id, title: product.title, type: 'DELETE_PRODUCT'}]})}>
                    Delete
                </button>
            </>
        )
    }

    return(
        <div className="card" style={{width: '20rem'}}>
            {
                auth.user && auth.user.role === 'admin' &&
                <input type='checkbox' checked={product.checked} className='position-absolute' style={{width: '20px', height: '20px'}} onChange={() => Check(product._id)}/>
            }
            {
                offers.map(off => (
                    off.products.map(discount => (
                        auth.user && auth.user.role === 'membership' && auth.user.membership === off.category && off.duration !== '0' && product._id === discount._id &&
                        <h4 style={{borderWidth: '1px', borderRadius: '50px', padding: '10px', backgroundColor: 'black', color: 'white', position: 'absolute', marginLeft: '100px', marginTop: '-25px'}}>{off.discount}% OFF</h4>
                    ))
                ))
            }
            <img src={product.images[0].url} className = "card-img-top" alt = {product.images[0].url}/>
            <div className="card-body">
                <h5 className="card-title text-capitalize" title={product.title}>{product.title}</h5>
                
                <div className="d-flex justify-content-between mx-0">
                    {
                        offers.map(off => (
                            off.products.map(discount => (
                                auth.user && auth.user.role === 'membership' && auth.user.membership === off.category && off.duration !== '0' && product._id === discount._id &&
                                <h6><del className="text-danger" style={{flex:1}}> ${product.price}</del></h6>
                            ))
                        ))
                    }
                    {
                        offers.map(off => (
                            off.products.map(discount => (
                                auth.user && auth.user.role === 'membership' && auth.user.membership === off.category && off.duration === '0' && product._id === discount._id &&
                                <h6 className="text-danger mx-4" style={{flex:1}}> ${product.price}</h6>
                            ))
                        ))
                    }
                    {
                        auth.user && auth.user.role !== 'membership' &&
                        <h6 className="text-danger mx-4" style={{flex:1}}> ${product.price}</h6>
                    }
                    {
                        offers.map(off => (
                            off.products.map(discount => (
                                auth.user && auth.user.role === 'membership' && auth.user.membership === off.category && off.duration !== '0' && product._id === discount._id &&
                                <h6 className="text-danger mx-4" style={{flex:1}}> ${product.price - (product.price*off.discount)/100}</h6>
                            ))
                        ))
                    }
                    {
                        offers.map(off => (
                            auth.user && auth.user.role === 'membership' && auth.user.membership !== off.category &&
                            <h6 className="text-danger mx-4" style={{flex:1}}> ${product.price}</h6>
                        ))
                    }
                    {
                        !auth.user &&
                        <h6 className="text-danger mx-4" style={{flex:1}}> ${product.price}</h6>
                    }
                    {
                        valid && valid.map(v => (
                            product._id === v._id && auth.user && <h6 className="text-danger" style={{flex:1}}> ${product.price}</h6>
                        ))
                    }
                    {
                        product.inStock > 0
                        ? <h6 className="text-danger mx-4" style={{flex:1}}> In Stock: {product.inStock}</h6>
                        : <h6 className="text-danger mx-4" style={{flex:1}}> Out of Stock</h6>
                    }
                </div>

                <p className="card-text" title={product.content}>{product.content}</p>
                
                <div className="row justify-content-between mx-0">
                    {!auth.user || auth.user.role !== 'admin' ? userLink() : adminLink()}
                </div>
                
            </div>
        </div>
    )
}

export default Items