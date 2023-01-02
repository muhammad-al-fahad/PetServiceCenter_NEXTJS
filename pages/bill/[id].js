import Head from 'next/head'
import Link from 'next/link'
import { useState, useContext, useEffect } from 'react'
import { DataContext } from '../../redux/store'
import { getData } from '../../utils/fetchData'

const DetailBill = (props) => {

    const {state, dispatch} = useContext(DataContext)
    const {petCategories, appointments} = state

    const [bill, setBill] = useState(props.bill)
    const [category, setCategory] = useState('')

    useEffect(() => {
        appointments.map(app => {
            if(app._id === bill.appointment){
                petCategories.map(pet => {
                    if(app.petData[0].petCategory === pet._id) setCategory(pet.name)
                })
            }
        })
    }, [petCategories, appointments])

    return (
        <div>
            <Head>
                <title>
                    Pets Result
                </title>
            </Head>

            <h1 className='text-uppercase text-warning' style={{marginLeft: '40%'}}> Results </h1>
                 <div className='px-0 my-4'>
                    <table className='table-bordered table-hover w-100 text-uppercase' style={{minWidth: '600px', cursor: 'pointer'}}>
                        <thead className='bg-dark font-weight-bold text-center text-light'>
                            <tr>
                                {bill.service === 'Check Up' && <td className='p-2'>Physical</td>}
                                {bill.service === 'Check Up' && <td className='p-2'>Visual</td>}
                                {bill.service !== 'Check Up' && <td className='p-2'>Result</td>}
                                <td className='p-2'>Prescription</td>
                            </tr>
                        </thead>
                        <tbody className='text-center'>     
                            <tr style={{cursor: 'pointer'}}>
                            {bill.service === 'Check Up' && <td className='p-2'><Link href={`/checkups/physical_examination/${bill.result[0].physical[0]._id}`}>{bill.result[0].physical[0]._id}</Link></td>}
                            {bill.service === 'Check Up' && <td className='p-2'><Link href={`/checkups/visual_examination/${bill.result[0].visual[0]._id}`}>{bill.result[0].visual[0]._id}</Link></td>}
                            {bill.service === 'Treatment' && <td className='p-2'><Link href={`/treatments/${bill.result[0].treatment[0]._id}`}>{bill.result[0].treatment[0]._id}</Link></td>}
                            {bill.service === 'Vaccination' && <td className='p-2'><Link href={category === 'Cat' ? `/vaccinations/cat_disease/${bill.result[0].vaccination[0]._id}` : `/vaccinations/dog_disease/${bill.result[0].vaccination[0]._id}`}>{bill.result[0].vaccination[0]._id}</Link></td>}
                            {bill.service === 'Diagnostic Test' && <td className='p-2'><Link href={`/diagnostic_tests/${bill.result[0].diagnostic_test[0]._id}`}>{bill.result[0].diagnostic_test[0]._id}</Link></td>}
                            <td className='p-2'><Link href={`/prescriptions/${bill.result[0].prescription[0]._id}`}>{bill.result[0].prescription[0]._id}</Link></td>
                            </tr>
                        </tbody>
                    </table>
                 </div>
        </div>
    )
}

export async function getServerSideProps({params: {id}}) {
    const res = await getData(`bill/${id}`)
    // Server Side Rendering
      return{
        props: {
          bill: res.bill
        }, // will be passed to the page component as props
      }
  }

export default DetailBill