import Head from 'next/head'
import { useState } from 'react'
import { getData } from '../../utils/fetchData'

const Treatment = (props) => {

    const [treatment, setTreatment] = useState(props.treatment)

    return (
        <div>
            <Head>
                <title>
                    Treatment Result Details
                </title>
            </Head>
            <div className= 'd-block col-md-4 my-4 offset-md-4'>
                <h2> Treatment Result </h2>
                <div className='px-0 my-4'>
                    <p> Physical Examination: {treatment.physical}</p>
                    <p> General Apperance: {treatment.general_apperance}</p>
                    <p> Eyes: {treatment.eyes}</p>
                    <p> Ears: {treatment.ears}</p>
                    <p> Respiratory: {treatment.respiratory}</p>
                    <p> Oral Exam: {treatment.oral_exam}</p>
                    <p> Lymph Nodes: {treatment.lymph_nodes}</p>
                    <p> Cardiovasscular: {treatment.cardiovasscular}</p>
                    <p> Abdomen: {treatment.abdomen}</p>
                    <p> Genitourinary: {treatment.genitourinary}</p>
                    <p> Skin: {treatment.skin}</p>
                    <p> Mussculos Keletal: {treatment.mussculos_keletal}</p>
                    <p> Neurological: {treatment.neurological}</p>
                    <p> Test: {treatment.test}</p>
                    <p> Treatment Plan: {treatment.treatment_plan}</p>
                    <h4 style={{fontWeight: 'bold'}}> Other Exam Finding </h4>

                    <p className='mx-4'> Fever: {treatment.other_exam_finding[0].fever ? <i className='fas fa-check-circle text-success'></i> : <i className='fas fa-times-circle text-danger'></i>}</p>
                    <p className='mx-4'> Digest: {treatment.other_exam_finding[0].digest ? <i className='fas fa-check-circle text-success'></i> : <i className='fas fa-times-circle text-danger'></i>}</p>
                    <p className='mx-4'> Lethargy: {treatment.other_exam_finding[0].lethargy ? <i className='fas fa-check-circle text-success'></i> : <i className='fas fa-times-circle text-danger'></i>}</p>
                    <p className='mx-4'> Diet: {treatment.other_exam_finding[0].diet ? <i className='fas fa-check-circle text-success'></i> : <i className='fas fa-times-circle text-danger'></i>}</p>
                    
                </div>
               </div>
        </div>
    )
}

export async function getServerSideProps({params: {id}}) {
    const res = await getData(`treatment/result/${id}`)
    // Server Side Rendering
      return{
        props: {
          treatment: res.result
        }, // will be passed to the page component as props
      }
  }

export default Treatment