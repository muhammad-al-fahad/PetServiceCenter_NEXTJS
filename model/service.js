const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
}, {timestamps: true})

let Dataset = mongoose.models.service || mongoose.model('service', serviceSchema)
export default Dataset