const mongoose = require("mongoose")

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = '/task-manager-api'

//mongoose.connect(connectionURL + databaseName, {
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})