const mongoose = require('mongoose')

const inspectionSchema = new mongoose.Schema({
    appointment: {
        type: mongoose.Types.ObjectId,
        ref: 'appointment'
    },
    body_condition: {
        type: String,
        required: true,
    },
    body_condition_score: {
        type: String,
        required: true
    },
    behavior: {
        type: String,
        required: true
    },
    posture: {
        type: String,
        required: true
    },
    gait: {
        type: String,
        required: true
    },
    defecation: {
        type: String,
        required: true
    },
    urination: {
        type: String,
        required: true
    },
    voice: {
        type: String,
        required: true
    },
    cough: {
        type: String,
        required: true
    }
}, {timestamps: true})

let Dataset = mongoose.models.inspection || mongoose.model('inspection', inspectionSchema)
export default Dataset