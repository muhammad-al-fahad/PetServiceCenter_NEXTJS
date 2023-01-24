import { useContext, useEffect, useState } from 'react'
import { DataContext } from '../../redux/store'

const Items = ({product, Check, id}) => {

    const {state, dispatch} = useContext(DataContext)
    const { auth, offers } = state
    const [discount, setDiscount] = useState('')

    console.log(id)

    useEffect(() => {
        offers.map(off => {
            off.products.forEach(pro => {
                if(product._id === pro._id) setDiscount(pro._id)
            })
        })
    }, [offers])

    return(
        <div className="card mx-4" style={{width: '20rem'}}>
            {
                auth.user && auth.user.role === 'admin' && product._id !== discount && !id &&
                    <input type='checkbox' checked={product.checked} className='position-absolute' style={{width: '20px', height: '20px'}} onChange={() => Check(product._id)}/>
            }
            {
                auth.user && auth.user.role === 'admin' && id &&
                    <input type='checkbox' checked={product.checked} className='position-absolute' style={{width: '20px', height: '20px'}} onChange={() => Check(product._id)}/>
            }
            {
                auth.user && auth.user.role === 'admin' && product._id === discount && !id &&
                    <em className='position-absolute text-capitalize text-light bg-dark px-4 py-2' style={{height: '40px', borderRadius: '20px', marginTop: '5%', marginLeft: '20%'}}>* Already In Offer *</em>
            }
            <img src={product.images[0].url} className = "card-img-top" alt = {product.images[0].url}/>
            <div className="card-body">
                <h5 className="card-title text-capitalize" title={product.title}>{product.title}</h5>
                
                <div className="row justify-content-between mx-0">
                    <h6 className="text-danger" style={{flex:1}}> ${product.price}</h6>
                    {
                        product.inStock > 0
                        ? <h6 className="text-danger" style={{flex:1}}> In Stock: {product.inStock}</h6>
                        : <h6 className="text-danger" style={{flex:1}}> Out of Stock</h6>
                    }
                </div>

                <p className="card-text" title={product.content}>{product.content}</p>
                
            </div>
        </div>
    )
}

export default Items