import PaypalMember from '../memberPaypal'
import StripeMember from '../memberStripe'

const Detail = ({detail, state, dispatch}) => {

    const {auth} = state
    const { user } = auth

    if(!auth.user) return <h2 className="text-danger mx-2 my-4"> Login to Proceed Payment </h2>
    return(
        <>
            {
                detail.map(member => (
                    <div key={member._id} className='d-flex justify-content-around' style={{margin: '20px auto'}}>
                       <div className='text-uppercase my-3 mx-3' style={{maxWidth: '650px'}}>
                            <h2 className='text-capitalize'> {member.category} Membership </h2>
                            <div className='mt-4 text-secondary'>
                                <h3 className='my-4'> Member Detail </h3>

                                    <div>
                                        <img className='my-4 mx-5' style={{borderRadius: '50%', objectFit: 'cover'}} src={auth.user.avatar} alt={auth.user.avatar} width='150px' height='150px'/>
                                        <p>Name: {user.name}</p>
                                        <p>Email: {user.email}</p>
                                        <p>Address: {user.address}</p>
                                        <p>Contact Number: {user.contact}</p>
                                        <p>CNIC: {user.cnic}</p>
                                        <p>Birth: {new Date(user.dateofbirth).toDateString()}</p>
                                        <p>Role: {user.role}</p>
                                    </div>
                                
                                <div className={`alert ${user.membership === member.category && user.role === 'membership' ? 'alert-success' : 'alert-danger'} d-flex align-items-center justify-content-between my-4`} role='alert'>
                                    {
                                        user.membership === member.category && user.role === 'membership' ? ` Become Membership at Date: ${new Date(user.dateOfPayment).toLocaleDateString()} AND Time: ${new Date(user.dateOfPayment).toLocaleTimeString()}` : 'Not Get Membership'
                                    }
                                </div>

                                <h3 className='my-4'> Payment </h3>
                                    {
                                        user.membership === member.category && user.role === 'membership' && <h6 className='my-2'>Method: <em>{user.method}</em></h6>
                                    }
                                    
                                    {
                                        user.membership === member.category  && user.role === 'membership' && <p className='my-2'>PaymentID: <em>{user.paymentID}</em></p>
                                    }
                                <div className={`alert ${user.membership === member.category && user.role === 'membership' ? 'alert-success' : 'alert-danger'} d-flex align-items-center justify-content-between`} role='alert'>
                                    {
                                        user.membership === member.category ? ` Paid at ${new Date(user.dateOfPayment).toDateString()}` : 'Not Paid'
                                    }
                                </div>

                            </div>
                       </div>
                            { user.membership !== member.category &&
                                <div className='p-4'>
                                    <h2 className='mb-4 text-uppercase'>Total: ${member.price}</h2>
                                    <PaypalMember members={member}/>
                                    <StripeMember members= {member} users= {user}/>
                                </div>
                            }
                    </div>
                ))
            }
        </>
    )
}

export default Detail