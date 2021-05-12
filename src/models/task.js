const mongoose = require("mongoose")

const taskSchema = mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        required: false,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        'ref': "User"
    }
}, {
    timestamps: true
})

const Tasks = mongoose.model("Task", taskSchema)


/* const read = new Tasks({
    task: "Read",
    completed: true
})

read.save().then((result) => {
    console.log(result);
}).catch((error) => {
    console.log("Error!", error);
}) */

module.exports = Tasks