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
    general_apperance: {
        type: String,
        default: '',
        required: true
    },
    physical: {
        type: mongoose.Types.ObjectId,
        ref: 'physical_examination'
    },
    eyes: {
        type: String,
        default: 'all',
        required: true
    },
    ears: {
        type: String,
        default: 'all',
        required: true
    },
    respiratory: {
        type: String,
        default: 'all',
        required: true
    },
    oral_exam: {
        type: String,
        default: '',
        required: true
    },
    lymph_nodes: {
        type: String,
        default: 'all',
        required: true
    },
    cardiovasscular: {
        type: String,
        default: 'all',
        required: true
    },
    abdomen: {
        type: String,
        default: 'all',
        required: true
    },
    genitourinary: {
        type: String,
        default: 'all',
        required: true
    },
    skin: {
        type: String,
        default: 'all',
        required: true
    },
    mussculos_keletal: {
        type: String,
        default: 'all',
        required: true
    },
    neurological: {
        type: String,
        default: 'all',
        required: true
    },
    other_exam_finding: Array,
    test: {
        type: String,
        default: '',
        required: true
    },
    treatment_plan: {
        type: String,
        default: '',
        required: true
    }
}, {timestamps: true})

let Dataset = mongoose.models.treatment_result || mongoose.model('treatment_result', resultSchema)
export default Dataset