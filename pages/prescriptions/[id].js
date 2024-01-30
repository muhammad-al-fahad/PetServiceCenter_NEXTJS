import Head from 'next/head'
import { useState } from 'react'
import { getData } from '../../utils/fetchData'

const Medicine = (props) => {

    const [physical, setPhysical] = useState(props.prescription)

    return (
        <div>
            <Head>
                <title>
                    Prescription
                </title>
            </Head>
            <div className= 'd-block'>
                <h2 className='col-md-4 my-4 offset-md-4'> Medicine </h2>
                <div className='px-0 my-4'>
                    <h4 className='col-md-4 my-4 offset-md-4'> Products </h4>
                    <table className='table-bordered table-hover w-100 text-uppercase' style={{minWidth: '600px', cursor: 'pointer'}}>
                        <thead className='bg-dark font-weight-bold text-center text-light'>
                            <tr>
                                <td className='p-2'>ID</td>
                                <td className='p-2'>Name</td>
                                <td className='p-2'>Strength /Pack Size</td>
                                <td className='p-2'>Quantity</td>
                                <td className='p-2'>Dose</td>                                  
                                <td className='p-2'>Instruction</td>
                            </tr>
                        </thead>
                        <tbody className='text-center'>
                            {
                                physical.product.map((pres) => (
                                    <tr key={pres._id}>
                                        <td className='p-2'>{pres._id}</td>
                                        <td className='p-2 text-capitalize'>{pres.product_name}</td>
                                        <td className='p-2'>{pres.product_strength}</td>
                                        <td className='p-2'>{pres.product_quantity}</td>
                                        <td className='p-2'>{pres.product_dose}</td>
                                        <td className='p-2 text-lowercase'>{pres.product_instruction}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    <div className='col-md-4 my-4 offset-md-4'>
                        <p> Repeat Prescription: {physical.repeat_prescription ? <i className='fas fa-check-circle text-success'></i> : <i className='fas fa-times-circle text-danger'></i>}</p>
                        <p> No. of Repeat Prescription: {physical.no_of_repeat_prescription}</p>
                        <p> Interval Between Repeat: {physical.interval_between_repeat}</p>
                        <p> Furthur Information: {physical.furthur_information}</p>
                        <p> Quantity In Each Repeat: {physical.quantity_in_each_repeat}</p>
                        <p> Expiry Date: {new Date(physical.prescription_expiry_date).toLocaleDateString()}</p>
                        <p> Total Quantity To Disease: {physical.total_quantity_to_disease}</p>
                        
                    </div>
                 </div>
               </div>
        </div>
    )
}

export async function getServerSideProps({params: {id}}) {
    const res = await getData(`prescription/${id}`)
    // Server Side Rendering
      return{
        props: {
          prescription: res.prescription
        }, // will be passed to the page component as props
      }
  }

export default Medicine