const mongoose = require('mongoose')

const medicineSchema = new mongoose.Schema({
    product_name: {
        type: String,
        default: '',
        required: true
    },
    product_strength: {
        type: Number,
        default: 0,
        required: true
    },
    product_quantity: {
        type: Number,
        default: 0,
        required: true
    },
    product_dose: {
        type: Number,
        default: 0,
        required: true
    },
    product_instruction: {
        type: String,
        default: '',
        required: true
    }
}, {timestamps: true})

let Dataset = mongoose.models.medicine || mongoose.model('medicine', medicineSchema)
export default Dataset