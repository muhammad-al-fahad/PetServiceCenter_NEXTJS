import Head from 'next/head'
import { useState } from 'react'
import { getData } from '../../../utils/fetchData'

const Vaccination = (props) => {

    const [vaccination, setVaccination] = useState(props.vaccination)

    return (
        <div>
            <Head>
                <title>
                    Vaccination Result Details
                </title>
            </Head>
            <div className= 'd-block col-md-4 my-4 offset-md-4'>
                <h2> Vaccination Result </h2>
                <div className='px-0 my-4'>
                    <p> Rabbies: {vaccination.rabbies}</p>
                    <p> Distemper: {vaccination.distemper}</p>
                    <p> Rhinotrachitis: {vaccination.rhinotrachitis}</p>
                    <p> Leukemia Virus: {vaccination.leukemia_virus}</p>
                    <p> Age: {vaccination.age_per_week} / Week</p>
                    <p> Vaccine: {vaccination.vaccine}</p>
                    <p> Vaccine Type: {vaccination.type_vaccine}</p>
                    <p> Core Vaccine: {vaccination.core_vaccine}</p>
                    <p> Non Core Vaccine: {vaccination.non_core_vaccine}</p>
                    <p> Condition: {vaccination.condition}</p>
                    
                </div>
               </div>
        </div>
    )
}

export async function getServerSideProps({params: {id}}) {
    const res = await getData(`vaccination/cat_disease/${id}`)
    // Server Side Rendering
      return{
        props: {
          vaccination: res.result
        }, // will be passed to the page component as props
      }
  }

export default Vaccination