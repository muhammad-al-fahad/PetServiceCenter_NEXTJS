const mongoose = require('mongoose')

const offerSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    poster: {
        type: String,
        default: "https://res.cloudinary.com/comsats-university-lahore/image/upload/v1661425783/Rehbar%20Pet%27s%20Clinic/animals-2222007__340_dlcdyf.webp",
        required: true
    },
    category: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    endDate: {
        type: Date,
        default: Date.UTC(2023, 12, 31),
        required: true
    },
    duration: {
        type: String,
        default: "0",
        required: true
    },
    checked: {
        type: Boolean,
        default: false
    },
    discount: {
        type: Number,
        default: 0,
        required: true
    },
    products: Array
    }, {timestamps: true})

let Dataset = mongoose.models.offer || mongoose.model('offer', offerSchema)
export default Dataset