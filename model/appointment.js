const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    doctor: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    doctorData: Array,
    pet: {
        type: mongoose.Types.ObjectId,
        ref: 'pet'
    },
    petData: Array,
    petName: {
        type: String,
        default: ''
    },
    service: {
        type: mongoose.Types.ObjectId,
        ref: 'service'
    },
    serviceData: Array,
    date: {
        type: Date,
        default: ""
    },
    time: {
        type: mongoose.Types.ObjectId,
        ref: 'time'
    },
    timeData: Array,
    accept: {
        type: Boolean,
        default: false
    },
    bill: {
        type: Boolean,
        default: false
    },
    reject: {
        type: Boolean,
        default: false
    },
    completed: {
        type: Boolean,
        default: false
    },
    pending: {
        type: Number,
        default: 0
    },
     
}, {timestamps: true})

let Dataset = mongoose.models.appointment || mongoose.model('appointment', appointmentSchema)
export default Dataset