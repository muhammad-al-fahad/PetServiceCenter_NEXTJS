import Head from 'next/head'
import {useContext, useState, useEffect} from 'react'
import { DataContext } from '../../redux/store'
import { useRouter } from 'next/router'
import { patchData } from '../../utils/fetchData'
import { updateItem } from '../../redux/action'

const Edit = () => {

    const {state, dispatch} = useContext(DataContext)
    const {auth, users} = state
    const router = useRouter()

    const {id} = router.query

    const [editUser, setEditUser] = useState([])
    const [checkAdmin, setCheckAdmin] = useState(false)
    const [checkDoctor, setCheckDoctor] = useState(false)
    const [checkOperator, setCheckOperator] = useState(false)
    const [checkMembership, setCheckMembership] = useState(false)
    const [checkUser, setCheckUser] = useState(false)
    const [num, setNum] = useState(0)

    useEffect(() => {
       users.forEach(user => {
        if(user._id === id){
            setEditUser(user)
            setCheckAdmin(user.role === 'admin' ? true : false)
            setCheckDoctor(user.role === 'doctor' ? true : false)
            setCheckOperator(user.role === 'operator' ? true : false)
            setCheckMembership(user.role === 'membership' ? true : false)
            setCheckUser(user.role === 'user' ? true : false)
        }
       })

    }, [users])

    const Admin = () => {
        if(!checkAdmin){
            setCheckAdmin(!checkAdmin)
            setCheckDoctor(false)
            setCheckOperator(false)
            setCheckMembership(false)
            setCheckUser(false)
            setNum(num + 1)
        }
    }

    const Doctor = () => {
        if(!checkDoctor){
            setCheckDoctor(!checkDoctor)
            setCheckAdmin(false)
            setCheckOperator(false)
            setCheckMembership(false)
            setCheckUser(false)
            setNum(num + 3)
            }
    }

    const Operator = () => {
        if(!checkOperator){
            setCheckOperator(!checkOperator)
            setCheckAdmin(false)
            setCheckDoctor(false)
            setCheckMembership(false)
            setCheckUser(false)
            setNum(num + 5)
            }
    }

    const Membership = () => {
        if(!checkMembership){
            setCheckMembership(!checkMembership)
            setCheckAdmin(false)
            setCheckDoctor(false)
            setCheckOperator(false)           
            setCheckUser(false)
            setNum(num + 7)
            }
    }

    const User = () => {
        if(!checkUser){
            setCheckUser(!checkUser)
            setCheckAdmin(false)
            setCheckDoctor(false)
            setCheckOperator(false)
            setCheckMembership(false)
            setNum(num + 9)
            }
    }

    const Submit = () => {

        let role = checkAdmin ? 'admin' : checkDoctor ? 'doctor' : checkOperator ? 'operator' : checkMembership ? 'membership' : 'user'

        if(num % 2 !== 0){
            dispatch({type: 'NOTIFY', payload: {loading: true}})
            patchData(`user/${editUser._id}`, {role}, auth.token).then(res => {
                if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})

                dispatch(updateItem(users, editUser._id, {
                  ...editUser, role
                }, 'ADD_USER'))
                setNum(0)
                return dispatch({type: 'NOTIFY', payload: {success: res.msg}})
            })
        }
    }

    return(
        <div className='edit_user my-3'>
            <Head>
                <title> Edit User </title>
            </Head>

            <div>
                <button className='btn btn-dark mx-2' onClick={() => router.back()}>
                    <i className='fas fa-long-arrow-alt-left' aria-hidden> GO BACK </i>
                </button>

                <div className='col-md-4 offset-md-4 my-4'>
                    <h2 className='text-uppercase text-secondary text-center'> Edit User </h2>

                    <div className='form-group my-2'>
                       <label htmlFor='name'> Name </label>
                       <input className='form-control my-2' type='text' id='name' defaultValue={editUser.name} disabled/>
                    </div>

                    <div className='form-group my-2'>
                       <label htmlFor='email'> Email </label>
                       <input className='form-control my-2' type='text' id='email' defaultValue={editUser.email} disabled/>
                    </div>
                    
                    <div className='d-flex justify-content-between'>

                    <div className='custom-control custom-checkbox d-flex my-4'>
                       <input className='custom-control-input' type='checkbox' id='isAdmin' checked={checkAdmin} style={{width: '20px', height: '25px', marginTop: '-2px'}} onChange={Admin}/>
                       <label className='custom-control-label' htmlFor='isAdmin' style={{transform: 'translate(4px, -3px)', marginRight: '10px'}}> isAdmin </label>
                    </div>
                    

                    <div className='custom-control custom-checkbox d-flex my-4'>
                       <input className='custom-control-input' type='checkbox' id='isDoctor' checked={checkDoctor} style={{width: '20px', height: '25px', marginLeft: '10px', marginTop: '-2px'}} onChange={Doctor}/>
                       <label className='custom-control-label' htmlFor='isDoctor' style={{transform: 'translate(4px, -3px)', marginRight: '10px'}}> isDoctor </label>
                    </div>
                    

                    <div className='custom-control custom-checkbox d-flex my-4'>
                       <input className='custom-control-input' type='checkbox' id='isOperator' checked={checkOperator} style={{width: '20px', height: '25px', marginLeft: '10px', marginTop: '-2px'}} onChange={Operator}/>
                       <label className='custom-control-label' htmlFor='isOperator' style={{transform: 'translate(4px, -3px)', marginRight: '10px'}}> isOperator </label>
                    </div>

                    <div className='custom-control custom-checkbox d-flex my-4'>
                       <input className='custom-control-input' type='checkbox' id='isMembership' checked={checkMembership} style={{width: '20px', height: '25px', marginLeft: '10px', marginTop: '-2px'}} onChange={Membership}/>
                       <label className='custom-control-label' htmlFor='isMembership' style={{transform: 'translate(4px, -3px)', marginRight: '10px'}}> isMembership </label>
                    </div>

                    <div className='custom-control custom-checkbox d-flex my-4'>
                       <input className='custom-control-input' type='checkbox' id='isUser' checked={checkUser} style={{width: '20px', height: '25px', marginLeft: '10px', marginTop: '-2px'}} onChange={User}/>
                       <label className='custom-control-label' htmlFor='isUser' style={{transform: 'translate(4px, -3px)', marginRight: '10px'}}> isUser </label>
                    </div>

                    </div>

                    <div className='text-center'>
                    <button className='btn btn-dark w-50' onClick={Submit}> Update </button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Edit