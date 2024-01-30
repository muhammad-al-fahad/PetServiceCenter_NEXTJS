import Head from 'next/head'
import Link from 'next/link'
import {useState, useContext, useEffect} from 'react'
import validation from '../utils/validation'
import { DataContext } from '../redux/store'
import {postData} from '../utils/fetchData'
import { useRouter } from 'next/router'

const initialState = {
    name: '',
    email: '',
    password: '',
    confirm_password: ''
}

const Signup = () => {

    const [user, setUser] = useState(initialState)
    const {name, email, password, confirm_password} = user
    const {state, dispatch} = useContext(DataContext)
    const { notify } = state
    const router = useRouter()
     
    const Handle = (e) => {
        const {name, value} = e.target
        setUser({...user, [name]: value})
        dispatch({type: 'NOTIFY', payload: {}})
    }
    
    const Submit = async (props) => {
        props.preventDefault()      

        const errMsg = validation(name, email, password, confirm_password)
        if(errMsg)
           return dispatch({type: 'NOTIFY', payload: {error: errMsg}})

        dispatch({type: 'NOTIFY', payload: {loading: true}})

        const res = await postData('auth/signup', user)
        if(res.err)
           return dispatch({type: 'NOTIFY', payload: {error: res.err}})
        
        dispatch({type: 'NOTIFY', payload: {success: res.msg}})

        return router.push('/login')
        
    }

    useEffect(() => {
        if(notify.success === "Registered SuccessFull!") router.push("/login")
     }, [notify.success])

    return(
        <div>
        <Head>
            <title>
                Signup
            </title>
        </Head>
            <form className='mx-auto my-4' style={{maxWidth: '500px'}} onSubmit={Submit}>
                <fieldset>

                    <div className="form-group my-4">
                    <label htmlFor="name"> Name</label>
                    <input type="name" id="name" className="form-control my-2" placeholder="Enter Your Full Name" name='name' value={name} onChange={Handle}/>
                    </div>
                    <div className="form-group my-4">
                    <label htmlFor="email"> Email</label>
                    <input type="email" id="email" className="form-control my-2" placeholder=" Enter Your Email Address" name='email' value={email} onChange={Handle}/>
                    </div>
                    <div className="form-group my-4">
                    <label htmlFor="password"> Password</label>
                    <input type="password" id="password" className="form-control my-2" placeholder="Enter Your Password" name='password' value={password} onChange={Handle}/>
                    </div>
                    <div className="form-group my-4">
                    <label htmlFor="confirm_password"> Confirm Password</label>
                    <input type="password" id="confirm_password" className="form-control my-2" placeholder="Enter Confirm Password" name='confirm_password' value={confirm_password} onChange={Handle}/>
                    </div>

                    <button type="submit" className="btn btn-primary my-2 w-50" style={{marginLeft: 100}}> Signup </button>

                    <p className='my-2'> Already have an account? <Link href='/login'><a style={{color: 'crimson'}}> Login Now </a></Link></p>
                </fieldset>
        </form>
      </div>
    )
}

export default Signup