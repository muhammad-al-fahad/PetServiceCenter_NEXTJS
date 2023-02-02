import Head from 'next/head'
import { useContext, useEffect, useState } from 'react'
import { DataContext} from '../redux/store'
import validation from '../utils/validation'
import { patchData} from '../utils/fetchData'
import { Upload } from '../utils/upload'


const Profile = () => {

    const initialState = {
        name: '',
        avatar: '',
        password: '',
        confirm_password: '',
        dateofbirth: '',
        contact: '',
        address: '',
        cnic: '',
        bio: '',
        designation: ''
    }

    const {state, dispatch} = useContext(DataContext)
    const { auth, notify} = state

    const [data, setData] = useState(initialState)
    const [age, setAge] = useState(0)
    const [currentdate, setCurrentDate] = useState(0)
    const {name, avatar, password, confirm_password, dateofbirth, contact, address, cnic, bio, designation} = data

    useEffect(() => {
        if(auth.user) setData({...data, name: auth.user.name, contact: auth.user.contact, address: auth.user.address, cnic: auth.user.cnic, dateofbirth: auth.user.dateofbirth, bio: auth.user.bio, designation: auth.user.designation}) 
    }, [auth.user])

    useEffect(() => {
        const date = new Date()
        
        setCurrentDate(date)
     }, [])
 
     useEffect (() => {
         const present = new Date().getTime()
         const past = new Date(dateofbirth).getTime()
         
         const forwardYear = new Date(present).getFullYear()
         const backwardYear = new Date(past).getFullYear()
 
         const forwardMonth = new Date(present).getMonth()
         const backwardMonth = new Date(past).getMonth()
 
         const forwardDay = new Date(present).getDate()
         const backwardDay = new Date(past).getDate()
 
         const monthThis = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
 
         if(backwardDay > forwardDay){
             forwardDay = forwardDay + monthThis[backwardMonth-1]
             forwardMonth = forwardMonth - 1
         }
 
         if(backwardMonth > forwardMonth){
             forwardYear = forwardYear - 1
             forwardMonth = forwardMonth + 12
         }
 
         const finalYear = forwardYear - backwardYear
         const finalMonth = forwardMonth - backwardMonth
         const finalDay = forwardDay - backwardDay
         
         if(finalYear < 0 || finalMonth < 0 || finalDay < 0 || (forwardYear === backwardYear && forwardMonth === backwardMonth && forwardDay === backwardDay)) return setAge(0)
         if(!dateofbirth) return setAge(0)
         if(finalYear) return setAge(`${finalYear} Years  ${finalMonth} Months  ${finalDay} Days`)
         if(finalMonth) return setAge(`${finalMonth} Months  ${finalDay} Days`)
         if(finalDay) return setAge(`${finalDay} Days`)

     }, [currentdate, Date.now, auth.user, dateofbirth])

    const Handle = (props) => {
        const {name, value} = props.target
        setData({...data, [name]: value})
        dispatch({ type: 'NOTIFY', payload: {} })
    }

    const Submit = (props) => {
        props.preventDefault()
        if(password){
            const errMsg = validation(name, auth.user.email, password, confirm_password)
            if(errMsg) 
                return dispatch({ type: 'NOTIFY', payload: {error: errMsg}})
            
            Password()
        }
        
        if(name !== auth.user.name || avatar) {
            if(name.length === 0) return dispatch({ type: 'NOTIFY', payload: {error: "Enter Your Name!"}})
            updateInfor()
        }

        if(age !== auth.user.age || address !== auth.user.address || contact !== auth.user.contact || cnic !== auth.user.cnic || avatar){
            if(dateofbirth && age === 0) return dispatch({ type: 'NOTIFY', payload: {error: "Enter correct Date of Birth!"}})
            if(address && address.length < 1) return dispatch({ type: 'NOTIFY', payload: {error: "Address should be of given format!"}})
            if(contact && contact.length !== 15) return dispatch({ type: 'NOTIFY', payload: {error: "Contact should be of 15 character format!"}})
            if(cnic && cnic.length !== 15) return dispatch({ type: 'NOTIFY', payload: {error: "CNIC should be of 15 character format!"}})
            basicInfo()
        }
    }

    const Password = () => {
        dispatch({ type: 'NOTIFY', payload: {loading: true}})
        patchData('user/reset', {password}, auth.token).then(res => {
            if(res.err) return dispatch({ type: 'NOTIFY', payload: {error: res.err}})
            return dispatch({ type: 'NOTIFY', payload: {success: res.msg}})
        })
    }

    const Avatar = (props) => {
        const file = props.target.files[0]
        if(!file) 
            return dispatch({ type: 'NOTIFY', payload: {error: "File does not exist!"}})

        if(file.size > 1024 * 1024)
            return dispatch({ type: 'NOTIFY', payload: {error: "File size is large!"}})

        if(file.type !== 'image/jpeg' && file.type !== 'image/png')
            return dispatch({ type: 'NOTIFY', payload: {error: "Image Format is incorrect!"}})

        setData({ ...data, avatar: file})
    }
      
    const updateInfor = async () => {
        let media;
        dispatch({ type: 'NOTIFY', payload: {loading: true}})
        if(avatar)
            media = await Upload([avatar])

        patchData('user/info', {name, avatar: avatar ? media[0].url : auth.user.avatar}, auth.token).then(res => {
            if(res.err) return dispatch({ type: 'NOTIFY', payload: {error: res.err}})

            dispatch({ type: 'AUTH', payload: {
                token: auth.token,
                user: res.user
            }})
            return dispatch({ type: 'NOTIFY', payload: {success: res.msg} })
        })
    }

    const basicInfo = async () => {

        dispatch({ type: 'NOTIFY', payload: {loading: true}})

        patchData('user/info', {dateofbirth, contact, address, cnic, age, bio, designation}, auth.token).then(res => {
            if(res.err) return dispatch({ type: 'NOTIFY', payload: {error: res.err}})

            dispatch({ type: 'AUTH', payload: {
                token: auth.token,
                user: res.user
            }})
            return dispatch({ type: 'NOTIFY', payload: {success: res.msg} })
        })
    }

    if(!auth.user) return null;

    return(
        <div className='profile_page'>
            <Head>
                <title>
                    Profile
                </title>
            </Head>
                <div className='mx-auto my-4' style={{maxWidth: '500px'}}>
                    <h3 className='text-center text-uppercase'> {auth.user.role === 'admin' ? 'Admin Profile' : auth.user.role === 'doctor' ? 'Doctor Profile' : auth.user.role === 'operator' ? 'Operator Profile' : 'User Profile'} </h3>
                    
                    <div className='avatar'>
                       <img className='profile_img' src={avatar ? URL.createObjectURL(avatar) : auth.user.avatar} alt='avatar'/>
                        <span>
                            <i className='fas fa-camera'></i>
                            <p> Change </p>
                            <input type='file' name='file' id='file_up' accept='image/*' onChange={Avatar}/>
                        </span>
                    </div>

                    <div className='form-group my-2'>
                    <label htmlFor='name'> Name </label>
                    <input className='form-control' type='text' name='name' id='name' value={name} placeholder='Your Name' onChange={Handle}/>
                    </div>

                    <div className='form-group my-2'>
                    <label htmlFor='email'> Email </label>
                    <input className='form-control' type='email' name='email' id='email' defaultValue={auth.user.email} placeholder='Your Email Address' disabled = {true}/>
                    </div>

                    <div className='form-group my-2'>
                    <label htmlFor='password'> New Password </label>
                    <input className='form-control' type='password' name='password' id='password' value={password} placeholder='New Password' onChange={Handle}/>
                    </div>

                    <div className='form-group my-2'>
                    <label htmlFor='confirm_password'> Confirm New Password </label>
                    <input className='form-control' type='password' name='confirm_password' id='confirm_password' value={confirm_password} placeholder='Confirm New Password' onChange={Handle}/>
                    </div>
                    <em style={{color: "crimson", margin: '10px 0 10px 0'}}>
                        ✮ If you update your password here, you will not able to login quickly using Facebook / Google ✮
                    </em>

                    <h5 className='my-4'> More Information </h5>
                    <div className="form-group my-4">
                    <label htmlFor="dateofbirth"> Date of Birth</label>
                    <input type="date" id="dateofbirth" className="form-control my-2" placeholder="Enter Your Date of Birth" name='dateofbirth' value={dateofbirth} onChange={Handle}/>
                    <h6>Age:- {age}</h6>
                    </div>
                    <div className="form-group my-4">
                    <label htmlFor="contact"> Contact</label>
                    <input type="text" id="contact" className="form-control my-2" placeholder="+92-XXXXXXXXX-X" name='contact' value={contact} onChange={Handle}/>
                    </div>
                    <div className="form-group my-4">
                    <label htmlFor="address"> Address</label>
                    <input type="text" id="address" className="form-control my-2" placeholder="[House No., Street, Area, City, State]" name='address' value={address} onChange={Handle}/>
                    </div>
                    <div className="form-group my-4">
                    <label htmlFor="cnic"> CNIC</label>
                    <input type="text" id="cnic" className="form-control my-2" placeholder="32303-XXXXXXX-X" name='cnic' value={cnic} onChange={Handle}/>
                    </div>
                    <div>
                        {
                            auth.user && auth.user.role === 'doctor' &&
                            <div>
                                <h5> Doctor Information </h5>

                                <div className="form-group my-4">
                                    <label htmlFor="designation"> Designation </label>
                                    <input type="text" id="designation" className="form-control my-2" placeholder="Assistant Professor" name='designation' value={designation} onChange={Handle}/>
                                </div>

                                <div className='form-group my-4'>
                                    <label htmlFor="bio" style={{fontWeight: 'bold'}}> Bio </label>
                                    <textarea id="bio" className="form-control my-2" cols='30' rows='8' placeholder="Enter your detail information about work" name='bio' value={bio} onChange={Handle}/>
                                </div>
                            </div>
                        }
                    </div>
                    <button className='btn btn-primary my-2 w-50' style={{marginLeft: 100}} disabled={notify.loading} onClick={Submit}> Update </button>
                </div>
        </div>
    )
}

export default Profile