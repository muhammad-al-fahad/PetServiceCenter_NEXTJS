const mongoose = require('mongoose')

const historySchema = new mongoose.Schema({
complaint: {
    type: String,
    required: true,
},
illness: {
    type: Number,
    required: true
},
appetite: {
    type: String,
    required: true
},
water_intake: {
    type: String,
    required: true
},
rummination: {
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
milk: {
    type: String,
    required: true
},
before_sickness : {
    type: String,
    required: true
},
present_amount: {
    type: String,
    required: true
},
premedication: {
    type: String,
    default: "Drugs / Dose / Repetition",
    required: true
},
treat_res: {
    type: String,
    default: "How do you treatment of your pet in your own prespective?"
},
at_risk: {
    type: Number,
    default: 0
},
sick: {
    type: Number,
    default: 0
},
dead: {
    type: Number,
    default: 0
},
partirution: {
    type: Date,
    default: Date.now
},
Gestation: {
    type: Date,
    default: Date.now
},
housing: Array,
preHistory: Array,
detail: {
    type: String,
    default: "write all details of above previous history"
},
green_feed: {
    type: String,
    required: true
},
concentrate: {
    type: String,
    required: true
},
supplement: {
    type: String,
    required: true
},
vaccination: {
    type: String,
    required: true
},
dewormer: {
    type: String,
    required: true
},
prevIllness: Array,
herd: {
    type: String,
    required: true
},
additional: {
    type: String,
    default: ""
}
}, {timestamps: true})

let Dataset = mongoose.models.history || mongoose.model('history', historySchema)
export default Dataset