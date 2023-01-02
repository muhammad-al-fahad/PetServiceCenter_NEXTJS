import mongoose from 'mongoose'

const ConnectDB = () => {
    if(mongoose.connections[0].readyState){
        console.log('Already Connected')
        return;
    }

    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (err) => {
        if(err) throw err
        console.log('Connected to mongodb')
    })
}

export default ConnectDB