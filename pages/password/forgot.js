import React, {useState, useContext} from 'react'
import { postData } from '../../utils/fetchData'
import { DataContext } from '../../redux/store'
import Head from 'next/head'

const ForgotPassword = () => {

  const {state, dispatch} = useContext(DataContext)

  const [email, setEmail] = useState('')

  const Submit = async (props) => {
      props.preventDefault()
      dispatch({type: 'NOTIFY', payload: {loading: true}})

      await postData('auth/forgot', {email}).then(res => {
        if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})

        dispatch({type: 'NOTIFY', payload: {success: res.msg}})
      })
  }

  return (
    <div>
        <Head>
          <title> Forgot Password </title>
        </Head>
        <div style={{marginTop: '10%'}}>
          <form className='mx-auto my-4' style={{maxWidth: '500px'}} onSubmit={Submit}>
            <fieldset> 
                <div className="form-group">
                    <label htmlFor='email'> Email Address </label>
                    <input className='form-control my-2' type="email" placeholder="Enter Email Address" id = "email" value={email} name="email" onChange={(props) => setEmail(props.target.value)}/>
                </div>
                <button type='submit' className='btn btn-primary my-4 w-50' style={{marginLeft: '20%', color: 'white'}}> Verify Your Email </button>
            </fieldset>
          </form>
        </div>
    </div>
  )
}

export default ForgotPassword