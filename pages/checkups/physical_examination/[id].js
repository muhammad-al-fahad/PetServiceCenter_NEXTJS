import Head from 'next/head'
import { useState } from 'react'
import { getData } from '../../../utils/fetchData'

const Examination = (props) => {

    const [physical, setPhysical] = useState(props.physical)

    return (
        <div>
            <Head>
                <title>
                    Physical Examination
                </title>
            </Head>
            <div className= 'd-block col-md-4 my-4 offset-md-4'>
                <h2> Examination </h2>
                <div className='px-0 my-4'>
                    <p> Capillary Refill Time: {physical.capillary_refill_time}</p>
                    <p> Conjunctiva: {physical.conjunctiva}</p>
                    <p> Ears: {physical.ears}</p>
                    <p> Grunt Test: {physical.grunt_test}</p>
                    <p> Heat Rhythm: {physical.heat_rhythm}</p>
                    <p> Lung Sounds: {physical.lung_sounds}</p>
                    <p> Milk: {physical.milk}</p>
                    <p> Nostrils: {physical.nostrils}</p>
                    <p> Oral Cavity: {physical.oral_cavity}</p>
                    <p> Pings: {physical.pings}</p>
                    <p> Rumen: {physical.rumen}</p>
                    <p> Rumen Motility: {physical.rumen_motility}</p>
                    <p> Skin: {physical.skin}</p>
                    <p> Tail: {physical.tail}</p>
                    <p> Temperature:
                        {physical.temperature[0].heart} Heart Rate
                        {physical.temperature[0].pulse} Pulse Rate
                        {physical.temperature[0].respiration} Respiration Rate  
                    </p>
                </div>
               </div>
        </div>
    )
}

export async function getServerSideProps({params: {id}}) {
    const res = await getData(`checkup/physical/${id}`)
    // Server Side Rendering
      return{
        props: {
          physical: res.physical
        }, // will be passed to the page component as props
      }
  }

export default Examination