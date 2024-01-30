const mongoose = require('mongoose')

const petSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
     },
    userDetail: {
        type: Array,
        required: true
    },
    petCategory: {
        type: String,
        required: true,
    },
    petSex: {
        type: String,
        required: true,
    },
    petName: {
        type: String,
        required: true
    },
    images: {
        type: Array,
        default: "https://res.cloudinary.com/comsats-university-lahore/image/upload/v1659383317/Rehbar%20Pet%27s%20Clinic/profile_tird38.png",
        required: true
    },
    dateofbirth: {
        type: Date,
        default: Date.now,
        required: true
    },
    checked: {
        type: Boolean,
        default: false,
    },
    age: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        required: true
    },
    disease: {
        type: String,
        default: "No Disease"
    }
    }, {timestamps: true})

let Dataset = mongoose.models.pet || mongoose.model('pet', petSchema)
export default Dataset