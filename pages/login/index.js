import Head from 'next/head'
import Link from 'next/link'
import {useState, useContext, useEffect} from 'react'
import { DataContext } from '../../redux/store'
import {postData} from '../../utils/fetchData'
import Cookie from 'js-cookie'
import { useRouter } from 'next/router'
import { GoogleLogin } from '@react-oauth/google';
import jwtDecode from 'jwt-decode'
import FacebookLogin from 'react-facebook-login';


const initialState = {
  email: '',
  password: '',
}

const Login = () => {

  const [user, setUser] = useState(initialState)
  const {email, password} = user
  const {state, dispatch} = useContext(DataContext)
  const {auth} = state
  const router = useRouter()

  const {activation_token} = router.query
   
  const Handle = (e) => {
      const {name, value} = e.target
      setUser({...user, [name]: value})
      dispatch({type: 'NOTIFY', payload: {}})
  }
  

  const Submit = async (props) => {
      props.preventDefault()
      dispatch({type: 'NOTIFY', payload: {loading: true}})

      const res = await postData('auth/login', user)
      if(res.err)
        return dispatch({type: 'NOTIFY', payload: {error: res.err}})
      dispatch({type: 'NOTIFY', payload: {success: res.msg}})
      
      dispatch({type: 'AUTH', payload: {
        token: res.access_token,
        user: res.user
      }})

      Cookie.set('refreshtoken', res.refresh_token, {
        path: 'api/auth/token',
        expires: 7
      })

      localStorage.setItem('firstLogin', true)     
  }

  const activationUser = async () => {

      await postData('auth/activate', {activation_token}).then(res => {
      if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})

      dispatch({type: 'NOTIFY', payload: {success: res.msg}})

      return router.push('/login')
      })
  }

  const responseGoogle = async (res) => {

    dispatch({type: 'NOTIFY', payload: {loading: true}})

    var decode = jwtDecode(res.credential)

    const googleID = await postData('auth/google', {decode})

    if(googleID.err) return dispatch({type: 'NOTIFY', payload: {error: googleID.err}})

    dispatch({type: 'NOTIFY', payload: {success: googleID.msg}})

    dispatch({
      type: 'AUTH',
      payload: {
          token: googleID.access_token,
          user: googleID.user
      }
    })

    Cookie.set('refreshtoken', googleID.refresh_token, {
      path: 'api/auth/token',
      expires: 7
    })

    localStorage.setItem('firstLogin', true)
  }

  const responseFacebook = async (res) => {

    dispatch({type: 'NOTIFY', payload: {loading: true}})

    const {accessToken, userID} = res

    const facebookID = await postData('auth/facebook', {accessToken, userID})

    if(facebookID.err) return dispatch({type: 'NOTIFY', payload: {error: facebookID.err}})

    dispatch({type: 'NOTIFY', payload: {success: facebookID.msg}})

    dispatch({
      type: 'AUTH',
      payload: {
          token: facebookID.access_token,
          user: facebookID.user
      }
    })

    Cookie.set('refreshtoken', facebookID.refresh_token, {
      path: 'api/auth/token',
      expires: 7
    })

    localStorage.setItem('firstLogin', true)
  }

  useEffect(() => {
    if(activation_token){
          activationUser()
    }else {
      if(Object.keys(auth).length !== 0) router.push("/")
    }
  }, [activation_token, auth])

    return(
      <div>
        <Head>
            <title>
                Login
            </title>
        </Head>
            <form className='mx-auto my-4' style={{maxWidth: '500px'}} onSubmit={Submit}>
                <fieldset>
                    <div className="form-group my-4">
                    <label htmlFor="email"> Email</label>
                    <input type="email" id="email" className="form-control my-2" placeholder="Enter Your Email Address" name='email' value={email} onChange={Handle}/>
                    </div>
                    <div className="form-group my-4">
                    <label htmlFor="password"> Password</label>
                    <input type="password" id="password" className="form-control my-2" placeholder="Enter Your Password" name='password' value={password} onChange={Handle}/>
                    </div>

                    <div className='d-flex my-2'>
                    <button type="submit" className="btn btn-primary w-50"> Login </button>
                    <p className='my-2' style={{marginLeft: '20%'}}><Link href="/password/forgot"><a style={{color: 'crimson'}}> Forgot Password? </a></Link> </p>
                    </div>

                    <div className='hr' style={{margin: '5% 40%', color: 'crimson', fontSize: '30px'}}> OR 
                      <h6 className='hr-with' style={{margin: '5% -25%', color: '#111', fontSize: '20px'}}> Login With </h6>
                    </div>
                    <div className='social'>
                    <GoogleLogin
                      width='500px'
                      useOneTap={true}
                      buttonText='Login With Google'
                      autoLoad={false}
                      onSuccess={responseGoogle}
                      cookiePolicy={'single_host_origin'}
                    />
                    <FacebookLogin
                      appId="765402431170483"
                      fields="id,name,email,picture"
                      scope="public_profile, email, user_birthday"
                      autoLoad={false}
                      icon='fa-facebook'
                      size='small'
                      callback={responseFacebook}
                    />
                    </div> 

                    <p className='my-4 text-center'> You dont have any account? <Link href='/signup'><a style={{color: 'crimson'}}> Signup </a></Link></p>
                </fieldset>
        </form>
      </div>
    )
}
  
export default Login