import { useContext } from 'react'
import { DataContext } from '../../redux/store'

const Items = ({product, Check}) => {

    const {state, dispatch} = useContext(DataContext)
    const { auth} = state

    return(
        <div className="card mx-4" style={{width: '20rem'}}>
            {
                auth.user && auth.user.role === 'admin' &&
                <input type='checkbox' checked={product.checked} className='position-absolute' style={{width: '20px', height: '20px'}} onChange={() => Check(product._id)}/>
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