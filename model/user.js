const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name!"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email!"],
    unique: true,
  },
  role: {
    type: String,
    default: 'user'
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Name!"],
  },
  root: {
    type: Boolean,
    default: false
  },
  avatar: {
    type: String,
    default: "https://res.cloudinary.com/comsats-university-lahore/image/upload/v1659383317/Rehbar%20Pet%27s%20Clinic/profile_tird38.png"
  },
  dateofbirth: {
    type: Date,
    default: Date.now
  },
  age: {
    type: String,
    default: '0'
  },
  contact: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    default: ""
  },
  latitude: {
    type: String,
    default: ""
  },
  longitude: {
    type: String,
    default: ""
  },
  cnic: {
    type: String,
    default: ''
  },
  paymentID: String,
  method: String,
  paid: {
    type: Boolean,
    default: false
  },
  endDate: {
      type: Date,
      default: Date.now
  },
  duration: {
      type: String,
      default: "0",
      required: true
  },
  membership: String,
  designation: {
    type: String,
    default: ""
  },
  bio: {
    type: String,
    default: ""
  },
  dateOfPayment: Date
}, {timestamps: true})

let Dataset = mongoose.models.user || mongoose.model('user', userSchema)
export default Dataset