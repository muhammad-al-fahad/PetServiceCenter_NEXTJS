import Head from 'next/head'
import Link from 'next/link'
import {useContext} from 'react'
import {DataContext} from '../../redux/store'

const Doctors = () => {

    const {state, dispatch} = useContext(DataContext)
    const {auth, doctors} = state

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

    if(auth.user && (auth.user.role !== 'user' && auth.user.role !== 'membership')) return null
    return (
        <div> 
            <Head>
                <title> Doctors </title>
            </Head>

            <div>
                {
                   doctors.map(doc => (
                        <div key={doc._id} className='my-4 mx-auto doctors w-100' style={{borderRadius: '110px 110px', background: 'rgba(210, 210, 210, 0.6)', maxWidth: '75%', maxHeight: '50%'}}>
                            <img className='mx-0 my-0' src={doc.avatar} alt={doc.avatar} width='220px' height='220px' style={{borderWidth: '1px', borderRadius: '50%', objectFit: 'cover'}}/>
                            <div className='d-block w-100'>
                            <div className='d-block w-100' style={{margin: '10px 0 10px 35px'}}>
                                <h5 className='text-capitalize text-success' style={{margin: '0 0 0 30%'}}>{doc.name}</h5>
                                <div className='doctors_link my-1 text-danger'>
                                    <div> Designation: {doc.designation}</div>
                                    <div className = 'email'> Email: {doc.email}</div>
                                </div>
                                {
                                    doc.bio.length > 200 ? <p>{handleWords(doc.bio)+'...'}<Link href={`/doctors/${doc._id}`}><h6 className='my-2 text-secondary' style={{cursor: 'pointer'}}> Read More </h6></Link></p> : <p className='my-2'> {doc.bio} </p>
                                }
                            </div>

                            <div className='mt-5 mb-0 w-100' style={{margin: '10px 0 10px 110px'}}>
                                <Link href={`/doctors/${doc._id}`}>
                                    <a><button className='btn btn-info w-50 text-light'> View </button></a>
                                </Link>         
                            </div>
                            </div>
                        </div>
                   ))
                }
            </div>
        </div>
    )
}

export default Doctors