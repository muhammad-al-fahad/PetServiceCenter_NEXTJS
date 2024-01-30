import React, { useContext, useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import {useRouter} from 'next/router'
import { DataContext } from '../redux/store'
import Cookie from 'js-cookie'

function Navbar() {

  const router = useRouter()
  const navRef = useRef()
  const {state, dispatch} = useContext(DataContext)
  const [ token, setToken] = useState('')
  const { auth, cart } = state

  useEffect(() => {
    if(auth.user) setToken(auth.token)
  }, [auth.user])

  const isActive = (props) => {
    if(props === router.pathname){
       return " active"
    }else{
       return ""
    }
  }

  const showHeader = () => {
    navRef.current.classList.toggle("responsive-nav")
  }

  const Active = (props) => {
    if(props === '/offers'){
      return "start-offer"
    }else if(props === '/product'){
      return "start-product"
    }else if(props === '/service'){
      return "start-service"
    }else if(props === '/memberships'){
      return "start-membership"
    }else if(props === '/doctors'){
      return "start-doctor"
    }else {
      return "start-home"
    }
  }

  const Logout = () => {
      Cookie.remove('refreshtoken', {path: 'api/auth/token'})
      localStorage.removeItem('firstLogin')
      dispatch({type: 'AUTH', payload: {}})
      dispatch({type: 'NOTIFY', payload: {success: "Logged Out!"}})
      router.push('/login')
  }

  const adminRouter = () => {
     return(
      <>
        <Link href='/order'>
          <a className="dropdown-item"> Orders </a>
        </Link>
        <Link href='/users'>
          <a className="dropdown-item"> Users </a>
        </Link>       
        <li className='dropdown-item dropright'><a style={{cursor: 'pointer'}}> Category <i className="fas fa-caret-right mx-1"></i></a>
        <div className='dropright-item'>
            <Link href="/category"><a className='dropdown-item'> Product </a></Link>
            <Link href="/petType"><a className='dropdown-item'> Pet </a></Link>
            <Link href='/timing'><a className='dropdown-item'> Timing </a></Link>
            <Link href='/services'><a className='dropdown-item'> Service </a></Link>
        </div>
        </li>
        <li className='dropdown-item dropcreate'><a style={{cursor: 'pointer'}}> Create <i className="fas fa-caret-right mx-1"></i></a>
        <div className='dropcreate-item'>
          <Link href='/create'>
            <a className="dropdown-item"><button className='btn btn-primary w-100'><i className='fas fa-plus' style={{marginLeft: '-20%'}}></i> <i style={{fontSize: '18px', fontWeight: 'bold', marginLeft: '20%'}}>Product</i></button></a>
          </Link>
          <Link href='/offer'>
            <a className="dropdown-item"><button className='btn btn-primary w-100'><i className='fas fa-plus' style={{marginLeft: '-35%'}}></i> <i style={{fontSize: '18px', fontWeight: 'bold', marginLeft: '20%'}}>Offer</i></button></a>
          </Link>
          <Link href='/membership'>
            <a className="dropdown-item"><button className='btn btn-primary w-100'><i className='fas fa-plus' style={{marginLeft: '-1%'}}></i> <i style={{fontSize: '18px', fontWeight: 'bold', marginLeft: '5%'}}>Membership</i></button></a>
          </Link>
        </div>
        </li>
      </>
     )
  }

  const userRouter = () => {
    return(
     <>
        <Link href='/order'>
          <a className="dropdown-item"> Orders </a>
        </Link>
        <li className='dropdown-item dropcreate'><a style={{cursor: 'pointer'}}> Pet <i className="fas fa-caret-right mx-1"></i></a>
        <div className='dropcreate-item'>
          <Link href={`/pets?token=${token}`}>
            <a className='dropdown-item'> Pets </a>
          </Link>
          <Link href='/pet'>
            <a className="dropdown-item"><button className='btn btn-primary w-100'><i className='fas fa-plus' style={{marginLeft: '-40%'}}></i> <i style={{fontSize: '18px', fontWeight: 'bold', marginLeft: '30%'}}>Pet</i></button></a>
          </Link>
        </div>
        </li>
        <Link href='/bill'>
          <a className="dropdown-item"> Bills </a>
        </Link>
        <Link href={`/appointment?token=${token}`}>
          <a className="dropdown-item"> Appointment </a>
        </Link>
        <li className='dropdown-item dropcreate'><a style={{cursor: 'pointer'}}> Results <i className="fas fa-caret-right mx-1"></i></a>
        <div className='dropcreate-item'>
            <li className='dropdown-item dropresult'><a style={{cursor: 'pointer'}}> Checkup <i className="fas fa-caret-right mx-1"></i></a>
              <div className='dropresult-item'>
                <Link href='/checkups/visual_examination'>
                  <a className='dropdown-item'> Visual Examination </a>
                </Link>
                <Link href='/checkups/physical_examination'>
                  <a className='dropdown-item'> Physical Examination </a>
                </Link>
              </div>
            </li>
            <Link href='/treatments'>
              <a className='dropdown-item'> Treatment </a>
            </Link>
            <li className='dropdown-item dropresult'><a style={{cursor: 'pointer'}}> Vaccination <i className="fas fa-caret-right mx-1"></i></a>
              <div className='dropresult-item'>
                <Link href='/vaccinations/dog_disease'>
                  <a className='dropdown-item'> Dog Disease </a>
                </Link>
                <Link href='/vaccinations/cat_disease'>
                  <a className='dropdown-item'> Cat Disease </a>
                </Link>
              </div>
            </li>
            <Link href='/diagnostic_tests'>
              <a className='dropdown-item'> Diagnostic Test </a>
            </Link>
            <Link href='/home_visits'>
              <a className='dropdown-item'> Home Visit </a>
            </Link>
            <Link href='/prescriptions'>
              <a className='dropdown-item'> Prescription </a>
            </Link>
        </div>
      </li>
     </>
    )
 }

 const doctorRouter = () => {
  return(
   <>
      <Link href='/order'>
        <a className="dropdown-item"> Orders </a>
      </Link>
      <Link href={`/appointment?token=${token}`}>
        <a className="dropdown-item"> Appointment </a>
      </Link>
      <li className='dropdown-item dropcreate'><a style={{cursor: 'pointer'}}> Results <i className="fas fa-caret-right mx-1"></i></a>
        <div className='dropcreate-item'>
            <li className='dropdown-item dropresult'><a style={{cursor: 'pointer'}}> Checkup <i className="fas fa-caret-right mx-1"></i></a>
              <div className='dropresult-item'>
                <Link href='/checkups/visual_examination'>
                  <a className='dropdown-item'> Visual Examination </a>
                </Link>
                <Link href='/checkups/physical_examination'>
                  <a className='dropdown-item'> Physical Examination </a>
                </Link>
              </div>
            </li>
            <Link href='/treatments'>
              <a className='dropdown-item'> Treatment </a>
            </Link>
            <li className='dropdown-item dropresult'><a style={{cursor: 'pointer'}}> Vaccination <i className="fas fa-caret-right mx-1"></i></a>
              <div className='dropresult-item'>
                <Link href='/vaccinations/dog_disease'>
                  <a className='dropdown-item'> Dog Disease </a>
                </Link>
                <Link href='/vaccinations/cat_disease'>
                  <a className='dropdown-item'> Cat Disease </a>
                </Link>
              </div>
            </li>
            <Link href='/diagnostic_tests'>
              <a className='dropdown-item'> Diagnostic Test </a>
            </Link>
            <Link href='/home_visits'>
              <a className='dropdown-item'> Home Visit </a>
            </Link>
            <Link href='/prescriptions'>
              <a className='dropdown-item'> Prescription </a>
            </Link>
        </div>
      </li>
   </>
  )
}

const operatorRouter = () => {
  return(
   <>
      <Link href='/order'>
        <a className="dropdown-item"> Orders </a>
      </Link>
      <Link href='/bill'>
        <a className="dropdown-item"> Bills </a>
      </Link>
      <Link href={`/appointment?token=${token}`}>
        <a className='dropdown-item'> Bill Generation </a>
      </Link>
      <li className='dropdown-item dropcreate'><a style={{cursor: 'pointer'}}> Results <i className="fas fa-caret-right mx-1"></i></a>
        <div className='dropcreate-item'>
            <li className='dropdown-item dropresult'><a style={{cursor: 'pointer'}}> Checkup <i className="fas fa-caret-right mx-1"></i></a>
              <div className='dropresult-item'>
                <Link href='/checkups/visual_examination'>
                  <a className='dropdown-item'> Visual Examination </a>
                </Link>
                <Link href='/checkups/physical_examination'>
                  <a className='dropdown-item'> Physical Examination </a>
                </Link>
              </div>
            </li>
            <Link href='/treatments'>
              <a className='dropdown-item'> Treatment </a>
            </Link>
            <li className='dropdown-item dropresult'><a style={{cursor: 'pointer'}}> Vaccination <i className="fas fa-caret-right mx-1"></i></a>
              <div className='dropresult-item'>
                <Link href='/vaccinations/dog_disease'>
                  <a className='dropdown-item'> Dog Disease </a>
                </Link>
                <Link href='/vaccinations/cat_disease'>
                  <a className='dropdown-item'> Cat Disease </a>
                </Link>
              </div>
            </li>
            <Link href='/diagnostic_tests'>
              <a className='dropdown-item'> Diagnostic Test </a>
            </Link>
            <Link href='/prescriptions'>
              <a className='dropdown-item'> Prescription </a>
            </Link>
        </div>
      </li>
   </>
  )
}


  const isUser = () => {
      return(
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle text-light" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <img src={auth.user.avatar} alt={auth.user.avatar} style={{borderRadius: '50%', width: '30px', height: '30px', transform: 'translateY(-3px)', marginRight: '5px'}}/>
              {auth.user.name}
            </a>
            <ul className="dropdown-menu mr-5" aria-labelledby="navbarDropdownMenuLink">
              <Link href='/profile'>
                <a className="dropdown-item">Profile</a>
              </Link>
              {
                auth.user.role === 'admin' && adminRouter()
              }
              {
                (auth.user.role === 'user' || auth.user.role === 'membership') && userRouter()
              }
              {
                auth.user.role === 'doctor' && doctorRouter()
              }
              {
                auth.user.role === 'operator' && operatorRouter()
              }
              <div className='dropdown-divider'></div>
              <button className="dropdown-item" onClick={Logout}>Logout</button>
            </ul>
          </li>
      )
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-primary">
    <div className="container-fluid">
      <div className='d-block'>
      <div>
      <Link href='/'>
      <a className='navbar-brand mx-0'><img src="https://res.cloudinary.com/comsats-university-lahore/image/upload/v1660334023/Rehbar%20Pet%27s%20Clinic/WhatsApp_Image_2022-05-19_at_10.06.20_PM_ijqpbr.jpg" alt="Pet Service Center" width="50" height="50" style={{borderWidth: 1, borderRadius: '50%'}}/></a>
      </Link>
      <Link href='/'>
      <a className="navbar-brand mx-2 text-light" href="#"> Pets Service Center </a>
      </Link>
      </div>
      <nav ref={navRef} className='d-flex my-2 navbar-link'>
        <Link href='/'><a className='mx-2'> Home </a></Link>
        <Link href='/product'><a className='mx-4'> Product </a></Link>
        <Link href='/offers'><a className='mx-4'> Offer </a></Link>
        <Link href='/service'><a className='mx-4'> Service </a></Link>
        <Link href='/memberships'><a className='mx-4'> Membership </a></Link>
        <Link href='/doctors'><a className='mx-4'> Doctors </a></Link>
        <div className= {`animation ${Active(router.pathname)}`}></div>
      </nav>
      </div>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation" onClick={showHeader}>
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse justify-content-end" style={{marginRight: 50}} id="navbarNav">
        <ul className="navbar-nav p-1">
          <li className="nav-item">
            <Link href='/cart'>
              <a className={"text-light nav-link" + isActive('/cart')}><i className='fas fa-shopping-cart position-relative text-danger' aria-hidden="true">
              <span className='text-light position-absolute bg-success' style={{padding: "2px 4.5px", borderRadius: '50%', top: '-13px', left: '3px', width: '15px', height: '15px', fontSize: '12px'}}>{cart.length}</span>
              </i> Cart</a>
            </Link> 
          </li>
          {
          Object.keys(auth).length === 0
           ? 
           <li className="nav-item">
            <Link href='/login'>
              <a className={"text-light nav-link" + isActive('/login')}><i className='fas fa-user text-light' aria-hidden="true"></i> Login</a>
            </Link> 
          </li>
           : 
           isUser()
           }
        </ul>
      </div>
    </div>
  </nav>
  )
}

export default Navbar