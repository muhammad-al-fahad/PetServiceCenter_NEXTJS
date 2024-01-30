import Head from 'next/head'
import Link from 'next/link'
import {useContext, useState, useEffect} from 'react'
import {DataContext} from '../../redux/store'
import { getData, putData } from '../../utils/fetchData'
import Filter from '../../components/petFilter'
import { useRouter } from 'next/router'
import filterProduct from '../../utils/filterProduct'

const Pets = (props) => {
    const {state, dispatch} = useContext(DataContext)
    const [pets, setPets] = useState(props.pets)
    const [isCheck, setIsCheck] = useState(false)
    const [page, setPage] = useState(1)
    const {auth} = state
    const router = useRouter()

    const Mapping = () => {

      pets.map((pet) => {
      
      const present = new Date().getTime()
      const past = new Date(pet.dateofbirth).getTime()
      
      const forwardYear = new Date(present).getFullYear()
      const backwardYear = new Date(past).getFullYear()

      const forwardMonth = new Date(present).getMonth()
      const backwardMonth = new Date(past).getMonth()

      const forwardDay = new Date(present).getDate()
      const backwardDay = new Date(past).getDate()

      const monthThis = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

      if(backwardDay > forwardDay){
          forwardDay = forwardDay + monthThis[backwardMonth-1]
          forwardMonth = forwardMonth - 1
      }

      if(backwardMonth > forwardMonth){
          forwardYear = forwardYear - 1
          forwardMonth = forwardMonth + 12
      }

      const finalYear = forwardYear - backwardYear
      const finalMonth = forwardMonth - backwardMonth
      const finalDay = forwardDay - backwardDay
      
      if(finalYear < 0 || finalMonth < 0 || finalDay < 0 || (forwardYear === backwardYear && forwardMonth === backwardMonth && forwardDay === backwardDay)) return pet.age = '0'
      if(!pet.dateofbirth) return pet.age = '0'
      if(finalYear) return pet.age = `${finalYear} Years  ${finalMonth} Months  ${finalDay} Days`
      if(finalMonth) return pet.age = `${finalMonth} Months  ${finalDay} Days`
      if(finalDay) return pet.age = `${finalDay} Days`

    })

  }

  useEffect(() => {
    Mapping()
  }, [Date.now, pets])


    const handleWords = (words) => {
      const arr = [...words]
      const reading = []
      arr.map((item, index) => {
        if(index < 200){
            reading.push(item)
        }
      })
      const bio = reading.toString().split(',').join('')
      return bio
    }

    useEffect(() => {
        setPets(props.pets)
      }, [props.pets])
    
      useEffect(() => {
        if(Object.keys(router.query).length === 0){
          setPage(1)
        }
      }, [router.query])
    
      const Check = (id) => {
        pets.forEach(pet => {
          if(pet._id === id) pet.checked = !pet.checked
        })
        setPets([...pets])
      }
    
      const Checked = () => {
        pets.forEach(pet => pet.checked = !isCheck)
        setPets([...pets])
        setIsCheck(!isCheck)
      }
    
      const Delete_All = () => {
        let delArr = []
        pets.forEach(pet => {
        if(pet.checked){
          delArr.push({
            data: '',
            id: pet._id,
            title: 'Delete All Selected Products?',
            type: 'ADD_PET'
          })
        }
        })
        dispatch({type: 'ADD_MODAL', payload: delArr})
      }
    
      const loadMore = () => {
        setPage(page + 1)
        filterProduct({router, page: page + 1})
      }

      const UpdateAge = async (props) => {
        const res = await putData(`pet/age/${props._id}`, {age: props.age}, auth.token)
        if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})
      }

    return(
        <div>
        <Head>
            <title> Manage Pets </title>
        </Head>

        <Filter state={state}/>

        {
          auth.user && (auth.user.role === 'user' || auth.user.role === 'membership') &&
          <div className='delete_all btn btn-danger mt-2 mx-2' style={{marginBottom: '-10px'}}>
            <input type='checkbox' checked={isCheck} style={{width: '25px', height: '25px', transform: 'translateY(8px)'}} onChange={Checked}/>
            <button className='btn btn-danger' style={{marginLeft: '15px'}} data-bs-toggle="modal" data-bs-target="#exampleModal" onClick = {Delete_All}> DELETE ALL </button>
          </div>
        }

        <div>
            {
                pets.length === 0 ?
                <h2 className='my-4 mx-2'> No Pets </h2> :
                pets.map(pet => (
                        <div key={pet._id} className='mx-auto my-4 w-100' style={{borderWidth: '1px', borderRadius: '110px', background: 'rgba(210, 210, 210, 0.6)', maxWidth: '75%', maxHeight: '50%'}}>
                            {
                                auth.user && (auth.user.role === 'user' || auth.user.role === 'membership') &&
                                <input type='checkbox' checked={pet.checked} className='position-absolute' style={{width: '20px', height: '20px'}} onChange={() => Check(pet._id)}/>
                            }
                        <div className='d-flex'>
                            <div>
                                <Link href={`pets/${pet._id}`}>
                                    <a>
                                        <img src={pet.images[0].url} alt={pet.images[0].url} width='220px' height='220px' style={{borderRadius: '50%', objectFit: 'cover'}} onClick={() => UpdateAge(pet)}/>
                                    </a>
                                </Link>
                            </div>
                            <div className='d-block w-100' style={{margin: '10px 0 10px 50px'}}>
                                <h5 className='text-capitalize' style={{margin: '0 0 0 30%'}}>{pet.petName}<Link href={`pets/${pet._id}`}><a onClick={() => UpdateAge(pet)}><i className='fas fa-eye mx-5' style={{color: 'darkblue', cursor: 'pointer'}}></i></a></Link></h5>
                                <div className='d-flex my-1 text-primary'>
                                    <div> Sex: {pet.petSex}</div>
                                    <div style={{marginLeft: '50%'}}> Birth: {new Date(pet.dateofbirth).toDateString()}</div>
                                </div>
                                {
                                    pet.bio.length > 200 ? <p>{handleWords(pet.bio)+'...'}<Link href={`pets/${pet._id}`}><h6 className='my-2 text-secondary' style={{cursor: 'pointer'}}> Read More </h6></Link></p> : <p className='my-2'> {pet.bio} </p>
                                }
                                <div className='mt-4'>
                                    <Link href={`/pet/${pet._id}`}>
                                        <a><button className='btn btn-success mx-5 w-25'> Edit </button></a>
                                    </Link>
                                        <a><button className='btn btn-danger mx-5 w-25' aria-hidden='true' data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => dispatch({type: 'ADD_MODAL', payload: [{data: '', id: pet._id, title: pet.petName, type: 'ADD_PET'}]})}> Delete </button></a>
                                </div>
                            </div>
                        </div>
                        </div>
                ))
            }
        </div>
        {
          props.result < page * 3 ? ""
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
    const token = query.token

    const res = await getData(`pet?limit=${page*3}&petCategory=${category}&sort=${sort}&petName=${search}`, token)  
    // Server Side Rendering
    return{
        props: {
          pets: res.pet,
          result: res.result
        } // will be passed to the page component as props
      }
  }

export default Pets