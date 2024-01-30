import Head from 'next/head'
import { useState } from 'react'
import { getData } from '../../../utils/fetchData'

const Examination = (props) => {

    const [physical, setPhysical] = useState(props.visual)

    return (
        <div>
            <Head>
                <title>
                    Visual Examination
                </title>
            </Head>
            <div className= 'd-block col-md-4 my-4 offset-md-4'>
                <h2> Examination </h2>
                <div className='px-0 my-4'>
                    <p> Abdomen: {physical.abdomen}</p>
                    <p> Chest: {physical.chest}</p>
                    <p> Ears: {physical.ears}</p>
                    <p> Eyes: {physical.eyes}</p>
                    <p> Face: {physical.face}</p>
                    <p> Faeces: {physical.faeces}</p>
                    <p> Ganitalia: {physical.ganitalia}</p>
                    <p> Horns: {physical.horns}</p>
                    <p> Limbs: {physical.limbs}</p>
                    <p> Lymph Nodes: {physical.lymph_nodes}</p>
                    <p> Mouth: {physical.mouth}</p>
                    <p> Muzzle: {physical.muzzle}</p>
                    <p> Neck: {physical.neck}</p>
                    <p> Sclera: {physical.sclera}</p>
                    <p> Nostrils: {physical.nostrils}</p>
                    <p> Skin: {physical.skin}</p>
                    <p> Tail: {physical.tail}</p>
                    <p> Udder: {physical.udder}</p>
                    <p> Urine: {physical.urine}</p>
                </div>
               </div>
        </div>
    )
}

export async function getServerSideProps({params: {id}}) {
    const res = await getData(`checkup/visual/${id}`)
    // Server Side Rendering
      return{
        props: {
          visual: res.visual
        }, // will be passed to the page component as props
      }
  }

export default Examination