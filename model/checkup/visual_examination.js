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
    face: {
        type: String,
        required: true,
    },
    ears: {
        type: String,
        required: true
    },
    horns: {
        type: String,
        required: true
    },
    eyes: {
        type: String,
        required: true
    },
    sclera: {
        type: String,
        required: true
    },
    muzzle: {
        type: String,
        required: true
    },
    nostrils: {
        type: String,
        required: true
    },
    mouth: {
        type: String,
        required: true
    },
    neck: {
        type: String,
        required: true
    },
    chest: {
        type: String,
        required: true
    },
    abdomen: {
        type: String,
        required: true
    },
    udder: {
        type: String,
        required: true
    },
    ganitalia: {
        type: String,
        required: true
    },
    limbs: {
        type: String,
        required: true
    },
    tail: {
        type: String,
        required: true
    },
    lymph_nodes: {
        type: String,
        required: true
    },
    skin: {
        type: String,
        required: true
    },
    faeces: {
        type: String,
        required: true
    },
    urine: {
        type: String,
        required: true
    }
}, {timestamps: true})

let Dataset = mongoose.models.visual_examination || mongoose.model('visual_examination', examinationSchema)
export default Dataset