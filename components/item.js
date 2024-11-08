import Link from 'next/link'
import { decrease, increase } from '../redux/action'


const Item = ({item, dispatch, cart}) => {
    return(
        <tr>
            <td style={{width:'100px', overflow: 'hidden'}}>
               <img className='img-thumbnail w-100' style={{minWidth: '80px', height: '80px'}} src={item.images[0].url} alt={item.images[0].url}/>
            </td>
            <td className="align-middle" style={{minWidth: '200px'}}>
                <h5 className='text-capitalize text-secondary'>
                    <Link href={`/product/${item._id}`}>
                       <a>{item.title}</a>
                    </Link>
                </h5>
                <h6 className='text-danger'>
                    ${item.quantity * item.price}
                </h6>
                {
                    item.inStock > 0
                    ? <p className='mb-1 text-danger'>In Stock: {item.inStock}</p>
                    : <p className='mb-1 text-danger'>Out of Stock</p>
                }
            </td>
            <td className='align-middle' style={{minWidth: '150px'}}>
                <button className='btn btn-outline-secondary' disabled={item.quantity === 1 ? true : false} onClick={() => dispatch(decrease(cart, item._id))}> - </button>
                <span className='px-3'>{item.quantity}</span>
                <button className='btn btn-outline-secondary' disabled={item.quantity === item.inStock ? true : false} onClick={() => dispatch(increase(cart, item._id))}> + </button>
            </td>
            <td className='align-middle' style={{minWidth: '50px', cursor: 'pointer'}}>
                <i className='far fa-trash-alt text-danger' aria-hidden='true' style={{fontSize: '18px'}} data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => dispatch({type: 'ADD_MODAL', payload: [{data: cart, id: item._id, title: item.title, type: 'ADD_CART'}]})}></i>
            </td>
        </tr>
    )
}

export default Item