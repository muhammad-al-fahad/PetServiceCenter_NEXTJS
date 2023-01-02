import Head from 'next/head'
import { useState, useEffect, useContext } from 'react'
import { getData } from '../../utils/fetchData'
import { DataContext } from '../../redux/store'

const DetailPet = (props) => {
     const [pet, setPet] = useState(props.pet)
     const [pettype, setPettype] = useState(props.pettype)
     const [age, setAge] = useState(pet.age)
     const [tab, setTab] = useState(0)
     const {state, dispatch} = useContext(DataContext)


     const isActive = (index) => {
      if(tab === index) return "active";
      return ""
     }

    return (
        <div>
            <Head>
                <title>
                    Detail Pet
                </title>
            </Head>
            {
              !pettype 
              ? (<div className='text-center' style={{maxWidth: '100%'}}>
                  <img src='https://res.cloudinary.com/comsats-university-lahore/image/upload/v1661258292/Rehbar%20Pet%27s%20Clinic/importedImage369388_14_rdgusd.jpg' alt='Category Are Not Avalaible' width = '100%' height = '100%' style={{objectFit: 'cover'}}/>
                  <h4 className='text-danger' style={{fontSize: '50px', position: 'absolute', top: '40%', left: '40%'}}> ERROR PET </h4>
                  <h4 className='text-primary' style={{fontSize: '30px', position: 'absolute', top: '55%', left: '25%'}}> This Pet Category Is Not Furthermore Used In System</h4>
                  <h6 className='text-dark' style={{fontSize: '16px', position: 'absolute', top: '65%', left: '27%'}}> So, Delete / Update your Pet Information Because it is not used in any operation of system</h6>
                </div>) 
              : (<div className='row detail_page justify-content-center'>
                  <div className='col-md-4 mx-3'>
                  <img src={pet.images[tab].url} alt={pet.images[tab].url} className="d-block img-thumbnail rounded mt-4 w-100" style={{height: '350px'}}/>
                  <div className='row mx-0' style={{cursor: 'pointer'}}>
                    {pet.images.map((img, index) => (
                          <img key={index} src={img.url} alt={img.url} className={`img-thumbnail rounded ${isActive(index)}`} style={{height: '80px', width: '20%', objectFit: 'cover'}} onClick = {() => setTab(index)} />
                    ))}
                  </div>
                  </div>

                  <div className='col-md-4 my-4 mx-4'>
                    <h2 className='text-uppercase'>{pet.petName}</h2>
                    <h6 className='text-secondary my-1'>Sex: {pet.petSex}</h6>
                    <div className='row d-flex justify-content-between'>
                      <h6 className='text-secondary my-1' style={{flex: 1}}>Birth: {new Date(pet.dateofbirth).toDateString()}</h6>
                      <h6 className='text-secondary my-1' style={{flex: 1}}>Age: {age}</h6>
                    </div>
                    <div className='my-2'>
                      <h5> About Pet </h5>
                      <p>{pet.bio}</p>
                    </div>
                    
                    <div className='my-2'>
                      <h5> About Pet Disease</h5>
                      <p>{pet.disease}</p>
                    </div>
                  </div>
                </div>)
            }
        </div>
    )
}

export async function getServerSideProps({params: {id}}) {
    const res = await getData(`pet/${id}`)
    // Server Side Rendering
      return{
        props: {
          pet: res.pet,
          pettype: res.pettype
        }, // will be passed to the page component as props
      }
  }

export default DetailPet