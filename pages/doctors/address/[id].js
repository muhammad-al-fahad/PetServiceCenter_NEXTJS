import Head from 'next/head'
import {
    useJsApiLoader,
    GoogleMap,
    Marker,
    DirectionsRenderer,
  } from '@react-google-maps/api'
  import { useState, useEffect } from 'react'
  import { getData } from '../../../utils/fetchData'
  
  const GOOGLE_MAP_API_KEY = "AIzaSyBjXwJ50Pri5nqgzxo-VeKsbUtcERkTMSM"
  
  const Directions = (props) => {
    const { isLoaded } = useJsApiLoader({
      googleMapsApiKey: GOOGLE_MAP_API_KEY,
      libraries: ['places'],
    })

    const [doctor, setDoctor] = useState(props.doctor)

    const [latitude, setLatitude] = useState('')
    const [longitude, setLongitude] = useState('')

    useEffect(() => {
      navigator.geolocation.getCurrentPosition((position) => {
          setLatitude(position.coords.latitude)
          setLongitude(position.coords.longitude)
      })
   }, [])

    const center = {lat: parseFloat(doctor.latitude), lng: parseFloat(doctor.longitude)}
    const random = {lat: 40.52, lng: 34.34}
  
    const origin = `${doctor.latitude}, ${doctor.longitude}`
    const desig = `${latitude && latitude}, ${longitude && longitude}`
    const random_01 = `${40.52}, ${34.34}`

    const [map, setMap] = useState(/** @type google.maps.Map */ (null))
    const [directionsResponse, setDirectionsResponse] = useState(null)
    const [distance, setDistance] = useState('')
    const [duration, setDuration] = useState('')

    if (!isLoaded) {
      return <div> Loading ...</div>
    }
  
    const calculateRoute = async () => {
      if (!doctor.latitude && !doctor.longitude || !latitude && !longitude) {
        return
      }
      // eslint-disable-next-line no-undef
      const directionsService = new google.maps.DirectionsService()
      const results = await directionsService.route({
        origin: doctor.latitude && doctor.longitude ? origin : random_01,
        destination: latitude && longitude ? desig : random_01,
        // eslint-disable-next-line no-undef
        travelMode: google.maps.TravelMode.DRIVING,
      })
      setDirectionsResponse(results)
      setDistance(results.routes[0].legs[0].distance.text)
      setDuration(results.routes[0].legs[0].duration.text)
    }
  
    const clearRoute = async () => {
      setDirectionsResponse(null)
      setDistance('')
      setDuration('')
    }
  
    if(doctor.length === 0) return null;
    return (
      <div>
      <Head>
          <title>
              Google Map
          </title>
      </Head>
      <div style={{height: '80vh', width: '100vw'}}>
        <div style={{height: '100%', width: '100%'}}>
          {/* Google Map Box */}
          <GoogleMap
            center={doctor.latitude && doctor.longitude ? center : random}
            zoom={15}
            mapContainerStyle={{ width: '100%', height: '100%' }}
            options={{
              zoomControl: true,
              streetViewControl: true,
              mapTypeControl: true,
              fullscreenControl: true,
            }}
            onLoad={map => setMap(map)}
          >
            <Marker position={doctor.latitude && doctor.longitude ? center : random} />
            {directionsResponse && (
              <DirectionsRenderer directions={directionsResponse} />
            )}
          </GoogleMap>
        </div>
        <div className="bg-primary" style={{position: 'absolute', top: '150px', left: '30%', color: 'white', borderRadius: '50px'}}>
          <div style={{display: 'flex', marginTop: '30px', marginRight: '20px'}}>
  
            <div style={{display: 'flex', marginLeft: '20px'}}>
              <ion-icon name="navigate-outline" size='large' style={{position: 'relative', marginLeft: '20px', cursor: 'pointer'}} aria-label='center back' onClick={() => {
                map.panTo(doctor.latitude && doctor.longitude ? center : doctor.address) 
                map.setZoom(15)
                }}
              ></ion-icon>
              <button className='btn btn-danger' style={{marginLeft: '30px'}} onClick={calculateRoute}> Calculate Route </button>
              <ion-icon name="close-circle-outline" size='large' aria-label='center back' onClick={clearRoute} style={{marginLeft: '30px', marginTop: '5px', cursor: 'pointer'}}></ion-icon>
            </div>
          </div>
          <div style={{display: 'flex', marginTop: '30px', marginRight: '20px', marginBottom: '30px'}}>
            <label style={{fontWeight: 'bold', marginLeft: '20px'}}> Distance: {distance} </label>
            <label style={{fontWeight: 'bold', marginLeft: '160px'}}> Duration: {duration} </label>
          </div>
        </div>
      </div>
      </div>
    )
  }

  export async function getServerSideProps({params: {id}}) {
    const res = await getData(`user/${id}`)
    // Server Side Rendering
      return{
        props: {
          doctor: res.user
        }, // will be passed to the page component as props
      }
  }
  
  export default Directions