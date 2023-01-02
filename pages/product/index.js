import { getData } from '../../utils/fetchData'
import { useState, useContext, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Items from '../../components/product/item'
import { DataContext } from '../../redux/store'
import filterProduct from '../../utils/filterProduct'
import Filter from '../../components/filter'

const Products = (props) => {
  const [products, setProducts] = useState(props.products)
  const [isCheck, setIsCheck] = useState(false)
  const [page, setPage] = useState(1)

  const {state, dispatch} = useContext(DataContext)
  const {auth} = state
  const router = useRouter()

  useEffect(() => {
    setProducts(props.products)
  }, [props.products])

  useEffect(() => {
    if(Object.keys(router.query).length === 0){
      setPage(1)
    }
  }, [router.query])

  const Check = (id) => {
    products.forEach(product => {
      if(product._id === id) product.checked = !product.checked
    })
    setProducts([...products])
  }

  const Checked = () => {
    products.forEach(product => product.checked = !isCheck)
    setProducts([...products])
    setIsCheck(!isCheck)
  }

  const Delete_All = () => {
    let delArr = []
    products.forEach(product => {
    if(product.checked){
      delArr.push({
        data: '',
        id: product._id,
        title: 'Delete All Selected Products?',
        type: 'DELETE_PRODUCT'
      })
    }
    })
    dispatch({type: 'ADD_MODAL', payload: delArr})
  }

  const loadMore = () => {
    setPage(page + 1)
    filterProduct({router, page: page + 1})
  }

  return(
    <div className='home_page'>
        <Head>
          <title>
              Pets Store 
          </title>
        </Head>

        <Filter state={state}/>

        {
          auth.user && auth.user.role === 'admin' &&
          <div className='delete_all btn btn-danger mt-2 mx-2' style={{marginBottom: '-10px'}}>
            <input type='checkbox' checked={isCheck} style={{width: '25px', height: '25px', transform: 'translateY(8px)'}} onChange={Checked}/>
            <button className='btn btn-danger' style={{marginLeft: '15px'}} data-bs-toggle="modal" data-bs-target="#exampleModal" onClick = {Delete_All}> DELETE ALL </button>
          </div>
        }

        <div className = "product">
        {
          products.length === 0 ?
          <h2> No Products </h2> :
          products.map(product => (
            <Items key={product._id} product={product} validate={products} Check={Check}/>
          ))
        }
      </div>
        {
          props.result < page * 8 ? ""
          : <button className='btn btn-outline-info d-block mx-auto mb-4' onClick={loadMore}> Load More </button>
        }
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

export default Products