const mongoose = require('mongoose')

const petTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    }
}, {timestamps: true})

let Dataset = mongoose.models.petType || mongoose.model('petType', petTypeSchema)
export default Dataset