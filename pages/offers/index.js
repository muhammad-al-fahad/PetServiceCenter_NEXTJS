import Head from 'next/head'
import Link from 'next/link'
import {useContext, useState, useEffect } from 'react'
import { getData, putData } from '../../utils/fetchData'
import { DataContext } from '../../redux/store'
import { useRouter } from 'next/router'
import Filter from '../../components/offerFilter'
import filterProduct from '../../utils/filterProduct'

const Offers = (props) => {
    const [offer, setOffer] = useState(props.offer)
    const [isCheck, setIsCheck] = useState(false)
    const [page, setPage] = useState(1)

    const {state, dispatch} = useContext(DataContext)
    const {auth} = state
    const router = useRouter()

    useEffect(() => {
        setOffer(props.offer)
    }, [props.offer])

    useEffect(() => {
        if(Object.keys(router.query).length === 0){
          setPage(1)
        }
    }, [router.query])

    const Check = (id) => {
        offer.forEach(offers => {
          if(offers._id === id) offers.checked = !offers.checked
        })
        setOffer([...offer])
    }

const Mapping = () => {

    offer.map((offers) => {

            const start = new Date(offers.startDate).getTime()
            const now = new Date().getTime()

            if(start < now){
                start = now
            }

            const end = new Date(offers.endDate).getTime()
            
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
            
            if(finalYear < 0 || finalMonth < 0 || finalDay < 0 || (startYear === endYear && startMonth === endMonth && startDay === endDay)) return offers.duration = '0'
     
            if(!offers.endDate) return offers.duration = '0'
            if(finalYear) return offers.duration = `${finalYear} Years  ${finalMonth} Months  ${finalDay} Days` 
            if(finalMonth) return offers.duration = `${finalMonth} Months  ${finalDay} Days` 
            if(finalDay) return offers.duration = `${finalDay} Days` 
    })
}

const UpdateDuration = async (props) => {

    const res = await putData(`offer/duration/${props._id}`, {duration: props.duration}, auth.token)
    if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})

}

const UpdateMember = (props) => {

    const res = putData(`product/membership/${props._id}`)
    if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})

}

useEffect(() => {
    auth.user && offer.map(offers => {
        offers.products.map(product => {
            if(offers.duration === '0') UpdateMember(product)
        })
    })
}, [Date.now])

useEffect(() => {
    Mapping()
}, [Date.now])

useEffect(() => {
    offer.map(offers => {
        UpdateDuration(offers)
    })
}, [Date.now])

const Checked = () => {
    offer.forEach(offers => offers.checked = !isCheck)
    setOffer([...offer])
    setIsCheck(!isCheck)
}

const loadMore = () => {
    setPage(page + 1)
    filterProduct({router, page: page + 1})
}

const Delete_All = () => {
    let delArr = []
    offer.forEach(offers => {
    if(offers.checked){
      delArr.push({
        data: '',
        id: offers._id,
        title: 'Delete All Selected Products?',
        type: 'ADD_OFFER'
      })
    }
    })
    dispatch({type: 'ADD_MODAL', payload: delArr})
}

    return(
        <div className='home_page'> 
            <Head>
                <title> Offers </title>
            </Head>
            <Filter category={offer.category}/>

            {
                auth.user && auth.user.role === 'admin' &&
                <div className='delete_all btn btn-danger mt-2 mx-2' style={{marginBottom: '-10px'}}>
                    <input type='checkbox' checked={isCheck} style={{width: '25px', height: '25px', transform: 'translateY(8px)'}} onChange={Checked}/>
                    <button className='btn btn-danger' style={{marginLeft: '15px'}} data-bs-toggle="modal" data-bs-target="#exampleModal" onClick = {Delete_All}> DELETE ALL </button>
                </div>
            }

            <div className = "offer" style={{flexGrow: 1}}>
                {
                offer.length === 0?
                <h2 className='my-4 mx-2'> No Offers </h2> :
                auth.user && offer.map(offers => (
                    <div key={offers._id}>
                    {
                        auth.user && auth.user.role === 'membership' && offers.duration === '0' ? <div></div> :
                    
                    <div className='my-4 w-100 col-md-8 offset-md-1'>
                    {
                        auth.user && auth.user.role === 'admin' && <div className='d-block'>
                        <input type='checkbox' checked={offers.checked} className='position-absolute' style={{width: '20px', height: '20px', cursor: 'pointer'}} onChange={() => Check(offers._id)}/>
                        <Link href={`/offer/${offers._id}`}><a><i className='fas fa-edit text-primary position-absolute' title='Edit' style={{marginTop: '30px'}}></i></a></Link>
                        <a><i className='fas fa-trash-alt text-danger position-absolute' title='Remove' style={{cursor: 'pointer', marginTop: '60px'}} aria-hidden='true' data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => dispatch({type: 'ADD_MODAL', payload: [{data: '', id: offers._id, title: offers.title, type: 'ADD_OFFER'}]})}></i></a>
                        </div>
                    }
                    <img src={offers.poster} alt={offers.poster} width='100%' height='300px' style={{objectFit: 'cover'}}/>
                    <div className='d-flex w-100 mx-0 mt-2'>
                    <h5 className='text-capitalize text-light bg-dark px-4 py-2' style={{position: 'relative', height: '40px', borderRadius: '20px', marginTop: '-300px', marginLeft: '40%'}}>{offers.duration}</h5>    
                    </div>
                    </div>
                    }
                    </div>
                ))
                }
            </div>
            {
                props.result < page * 3 ? ""
                : auth.user && <button className='btn btn-outline-info d-block mx-auto mb-4' onClick={loadMore}> Load More </button>
            }
        </div>
    )
}

export async function getServerSideProps({query}) {

    const page = query.page || 1
    const category = query.category || 'all'
    const sort = query.sort || '-createdAt'
    const search = query.search || 'all'
    
    const res = await getData(`offer?limit=${page*3}&category=${category}&sort=${sort}&title=${search}`)

    return{
        props: {
            offer: res.offer,
            result: res.result,
        }
    }
} 

export default Offers