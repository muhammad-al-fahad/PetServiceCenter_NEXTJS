import connectDB from '../../../utils/mongodb'
import Users from '../../../model/user'
import jwt from 'jsonwebtoken'
import { createAccessToken } from '../../../utils/token'

connectDB()

const Token = async (req, res) => {
    try{
        const token = req.cookies.refreshtoken;
        if(!token) 
            return res.status(400).json({err: "Please Login Now"})

        const result = jwt.verify(token, process.env.REFRESH_TOKEN)
        if(!result)
            return res.status(400).json({err: "Your cookie is expired"})

        const user = await Users.findById(result.id)
        if(!user)
            return res.status(400).json({err: "User doesn't exist"})

        const access_token = createAccessToken({id: user._id})
        res.json({
            access_token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                root: user.root,
                dateofbirth: user.dateofbirth,
                age: user.age,
                contact: user.contact,
                address: user.address,
                latitude: user.latitude,
                longitude: user.longitude,
                cnic: user.cnic,
                paymentID: user.paymentID,
                dateOfPayment: user.dateOfPayment,
                method: user.method,
                paid: user.paid,
                membership: user.membership,
                endDate: user.endDate,
                duration: user.duration,
                bio: user.bio,
                designation: user.designation
            }
        })
         
    }
    catch(err) {
        return res.status(400).json({err: err.message})
    }
}

export default Token