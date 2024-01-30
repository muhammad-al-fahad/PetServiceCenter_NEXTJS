import jwt from 'jsonwebtoken'
import Users from '../model/user'

const auth = async (req, res) => {
      const token = req.headers.authorization;
      if(!token) return res.status(400).json({err: 'Invalid Authentication'})

      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN)
      if(!decoded) return res.status(400).json({err: 'Invalid Authentication'})

      const user = await Users.findOne({_id: decoded.id})

      return {id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, root: user.root, dateofbirth: user.dateofbirth, age: user.age, contact: user.contact, address: user.address, cnic: user.cnic, bio: user.bio, designation: user.designation, membership: user.membership, latitude: user.latitude, longitude: user.longitude};
}

export default auth