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
    operator: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    rabbies: {
        type: String,
        default: 'all',
        required: true
    },
    distemper: {
        type: String,
        default: 'all',
        required: true
    },
    bordetella: {
        type: String,
        default: 'all',
        required: true
    },
    lyme: {
        type: String,
        default: 'all',
        required: true
    },
    parvo: {
        type: String,
        default: 'all',
        required: true
    },
    leptospiroses: {
        type: String,
        default: 'all',
        required: true
    },
    hepatitis: {
        type: String,
        default: 'all',
        required: true
    },
    parainfluenza: {
        type: String,
        default: 'all',
        required: true
    },
    age_per_week: {
        type: Number,
        default: 0,
        required: true
    },
    vaccine: {
        type: String,
        default: 'all',
        required: true
    },
    type_vaccine: {
        type: String,
        default: 'all',
        required: true
    },
    core_vaccine: {
        type: String,
        default: 'all',
        required: true
    },
    non_core_vaccine: {
        type: String,
        default: 'all',
        required: true
    },
    condition: {
        type: String,
        default: '',
        required: true
    }
}, {timestamps: true})

let Dataset = mongoose.models.dog_disease || mongoose.model('dog_disease', resultSchema)
export default Dataset