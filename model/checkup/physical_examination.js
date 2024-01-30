const mongoose = require('mongoose')

const examinationSchema = new mongoose.Schema({
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
    temperature: Array,
    heat_rhythm: {
        type: String,
        required: true
    },
    lung_sounds: {
        type: String,
        required: true
    },
    ears: {
        type: String,
        required: true
    },
    skin: {
        type: String,
        required: true
    },
    rumen: {
        type: String,
        required: true
    },
    rumen_motility: {
        type: String,
        required: true
    },
    pings: {
        type: String,
        required: true
    },
    grunt_test: {
        type: String,
        required: true
    },
    oral_cavity: {
        type: String,
        required: true
    },
    capillary_refill_time: {
        type: String,
        required: true
    },
    conjunctiva: {
        type: String,
        required: true
    },
    nostrils: {
        type: String,
        required: true
    },
    tail: {
        type: String,
        required: true
    },
    milk: {
        type: String,
        required: true
    }
}, {timestamps: true})

let Dataset = mongoose.models.physical_examination || mongoose.model('physical_examination', examinationSchema)
export default Dataset