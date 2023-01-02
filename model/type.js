const mongoose = require('mongoose')

const typeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
}, {timestamps: true})

let Dataset = mongoose.models.type || mongoose.model('type', typeSchema)
export default Dataset