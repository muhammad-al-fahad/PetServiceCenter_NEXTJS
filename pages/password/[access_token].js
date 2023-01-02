import React, {useState, useContext} from 'react'
import { postData } from '../../utils/fetchData'
import { DataContext } from '../../redux/store'
import { useRouter } from 'next/router'
import Head from 'next/head'


const initialState = {
  password: '',
  confirm_password: '',
}

const ResetPassword = () => {

    const router = useRouter()
    const {state, dispatch} = useContext(DataContext)

    const {access_token} = router.query
    const [data, setData] = useState(initialState)

    const {password, confirm_password} = data

    const Handle = (props) => {
      const {name, value} = props.target
      setData({...data, [name]: value})
      dispatch({type: 'NOTIFY', payload: []})
    }

    const Submit = async (props) => {
      props.preventDefault()
      dispatch({type: 'NOTIFY', payload: {loading: true}})

      const res = await postData('auth/reset', {password, confirm_password, access_token})
      if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})

      dispatch({type: 'NOTIFY', payload: {success: res.msg}})
    }

  return (
    <div>
      <Head>
        <title> Reset Password </title>
      </Head>
      <div style={{marginTop: '5%'}}>
        <form className='mx-auto my-0' style={{maxWidth: '500px'}} onSubmit={Submit}>
            <fieldset>
                  <div className='form-group'>
                      <label htmlFor='password'> Password </label>
                      <input className='form-control my-2' type="password" placeholder="Enter Password" id = "password" value={password} name="password" onChange={Handle}/>
                  </div>

                  <div className='form-group my-4'>
                      <label htmlFor='confirm_password'> Confirm Password </label>
                      <input className='form-control my-2' type="password" placeholder="Confirm Password" id = "confirm_password" value={confirm_password} name="confirm_password" onChange={Handle}/>
                  </div>

                  <button className='btn btn-primary my-4 w-50' type='submit' style={{marginLeft: '20%', color: 'white'}}> Update </button>
              </fieldset>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword