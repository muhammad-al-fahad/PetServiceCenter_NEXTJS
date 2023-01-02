import Head from 'next/head'
import { useState } from 'react'
import { getData } from '../../utils/fetchData'

const Home_Visit = (props) => {

    const [home_visit, setHome_visit] = useState(props.home_visit)

    return (
        <div>
            <Head>
                <title>
                    Home Visit Details
                </title>
            </Head>
            <div className= 'd-block col-md-4 my-4 offset-md-4'>
                <h2> Home Visit </h2>
                <div className='px-0 my-4'>
                    <p> Service: {home_visit.service}</p>
                    <p> Guidence: {home_visit.guidence}</p>
                    
                </div>
               </div>
        </div>
    )
}

export async function getServerSideProps({params: {id}}) {
    const res = await getData(`home_visit/result/${id}`)
    // Server Side Rendering
      return{
        props: {
            home_visit: res.result
        }, // will be passed to the page component as props
      }
  }

export default Home_Visit