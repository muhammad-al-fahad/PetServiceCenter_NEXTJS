import Head from 'next/head'
import { useState } from 'react'
import { getData } from '../../utils/fetchData'

const Diagnostic_Test = (props) => {

    const [diagnostic_test, setDiagnostic_test] = useState(props.diagnostic_test)

    return (
        <div>
            <Head>
                <title>
                    Diagnostic Test Details
                </title>
            </Head>
            <div className= 'd-block col-md-4 my-4 offset-md-4'>
                <h2> Diagnostic Test </h2>
                <div className='px-0 my-4'>
                    <p> Test Type: {diagnostic_test.test_type}</p>
                    <p> Test Reason: {diagnostic_test.reason_test}</p>
                    <p> Disease Type: {diagnostic_test.disease_type}</p>
                    <p> Disease Reason: {diagnostic_test.disease_reason}</p>
                    <p> Infection: {diagnostic_test.infection ? <i className='fas fa-check-circle text-success'></i> : <i className='fas fa-times-circle text-danger'></i>}</p>
                    <p> Injury: {diagnostic_test.injury ? <i className='fas fa-check-circle text-success'></i> : <i className='fas fa-times-circle text-danger'></i>}</p>
                    <p> Fracture: {diagnostic_test.fracture ? <i className='fas fa-check-circle text-success'></i> : <i className='fas fa-times-circle text-danger'></i>}</p>
                    
                </div>
               </div>
        </div>
    )
}

export async function getServerSideProps({params: {id}}) {
    const res = await getData(`diagnostic_test/result/${id}`)
    // Server Side Rendering
      return{
        props: {
            diagnostic_test: res.result
        }, // will be passed to the page component as props
      }
  }

export default Diagnostic_Test