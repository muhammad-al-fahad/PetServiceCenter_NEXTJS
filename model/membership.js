const mongoose = require('mongoose')

const membershipSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: "https://res.cloudinary.com/comsats-university-lahore/image/upload/v1661623204/Rehbar%20Pet%27s%20Clinic/membership-icon-participation-185439420-removebg-preview_m99u3e.png",
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        default: 0,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    types: {
        type: Array,
        required: true
     },
    day: {
        type: String,
        required: true
    }
    }, {timestamps: true})

let Dataset = mongoose.models.membership || mongoose.model('membership', membershipSchema)
export default Dataset