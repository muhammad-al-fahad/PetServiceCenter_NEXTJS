import Link from 'next/link'
import { useEffect } from 'react'
import { putData } from '../../utils/fetchData'

const Items = ({users, members, state, dispatch}) => {

    const {member, auth} = state

    // For 6 Months 15616339307
    // For 1 Year 31516339307
    // For 1 Month 2526339307

    const UpdateTime = () => {
        const start = new Date().getTime()
        const endDate = new Date(users.endDate).getTime()
        
        const startYear = new Date(start).getFullYear()   
        const endYear = new Date(endDate).getFullYear()
 
        const startMonth = new Date(start).getMonth()
        const endMonth = new Date(endDate).getMonth()
 
        const startDay = new Date(start).getDate()
        const endDay = new Date(endDate).getDate()
 
        const monthThis = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
 
        if(startDay > endDay){
             endDay = endDay + monthThis[startMonth-1]
             endMonth = endMonth - 1
        }
 
        if(startMonth > endMonth){
            endYear = endYear - 1
            endMonth= endMonth + 12
        }
 
        const finalYear = endYear - startYear
        const finalMonth = endMonth - startMonth
        const finalDay = endDay - startDay
        
        if(finalYear < 0 || finalMonth < 0 || finalDay < 0 || (startYear === endYear && startMonth === endMonth && startDay === endDay)) return users.duration = "0"
 
        if(!users.endDate && users.role !== 'membership') return users.duration = "0"
        if(finalYear) return users.duration = `${finalYear} Years  ${finalMonth} Months  ${finalDay} Days`
        if(finalMonth) return users.duration = `${finalMonth} Months  ${finalDay} Days`
        if(finalDay) return users.duration = `${finalDay} Days`
    }

    console.log(users);

    const UpdateDuration = async () => { 
        
        const res = await putData(`membership/duration/${members._id}`, {duration: users.duration, token: users.id}, auth.token)
        if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}}) 
    }

    const UpdateMembership = async () => {
        const resp = await putData(`user/duration/${users.id}`, {duration: users.duration, paid: false}, auth.token)
        if(resp.err) return dispatch({type: 'NOTIFY', payload: {error: resp.err}}) 
    }

    useEffect (() => {
        UpdateDuration()
        if(users.duration === "0" && users.role === 'membership') UpdateMembership();
    }, [Date.now])

    useEffect(() => {
        if(users.membership === members.category && users.role === 'membership') UpdateTime()
    }, [Date.now, users, members])

    const userLink = () => {
        return(
            <>
                <Link href={`/memberships/${members._id}`}>
                    <a className='btn btn-info' style={{marginRight: '5px', flex: 1, color: 'white'}}> Proceed with payment </a>
                </Link>
            </>
        )
    }
    
    const adminLink = () => {
        return(
            <>
                <Link href={`/membership/${members._id}`}>
                    <a className='btn btn-info w-50' style={{marginRight: '5px', flex: 1}}> Edit </a>
                </Link>
                <button className='btn btn-danger w-50' style={{marginLeft: '5px', flex: 1}} data-bs-toggle="modal" data-bs-target="#exampleModal" onClick = {() => dispatch({type: 'ADD_MODAL', payload: [{data: member, id: members._id, title: members.category, type: 'ADD_MEMBER'}]})}>
                    Delete
                </button>
            </>
        )
    }

    const typesLink = (members) => {
        return (
            <>
                {
                    members.types.map(map => (
                        <div key={map._id} className='d-flex my-2'>
                            <i className='far fa-check-circle text-success'></i>
                            <p className='mx-3 my-0' title={map.name}>{map.name}</p>
                        </div>
                    ))
                }
            </>
        )
    }
    
    return(
        <div className="card" style={{width: '27rem'}}>
            <img src={members.image} className = "card-img-top" alt = {members.image}/>
            <div className="card-body">
                <h5 className="card-title text-capitalize" title={members.title}>{members.title}</h5>
                
                <div className="row justify-content-between">
                    <h6 className="text-danger" style={{flex:1}}> ${members.price}/{members.day}</h6>
                    {users.role === 'membership' && users.membership === members.category && <h6 className="text-danger" style={{flex:1}}> Duration: {users.duration}</h6>}
                </div>

                <p className="card-text" title={members.description}>{members.description}</p>

                <div className="column justify-content-start my-0">
                    {members.types && typesLink(members)}
                </div>            
            </div>

            <div className="row justify-content-between mx-1 my-4">
                {!auth.user || auth.user.role !== 'admin' ? userLink() : adminLink()}
            </div>
        </div>
    )
}

export default Items