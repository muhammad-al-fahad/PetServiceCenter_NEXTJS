const mongoose = require('mongoose')

const resultSchema = new mongoose.Schema({
    appointment: {
        type: mongoose.Types.ObjectId,
        ref: 'appointment'
    },
    doctor: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    service: {
        type: String,
        default: 'all',
        required: true
    },
    guidence: {
        type: String,
        default: '',
        required: true
    },
}, {timestamps: true})

let Dataset = mongoose.models.home_result || mongoose.model('home_result', resultSchema)
export default Dataset