const mongoose = require('mongoose')

const timeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
}, {timestamps: true})

let Dataset = mongoose.models.timing || mongoose.model('timing', timeSchema)
export default Dataset