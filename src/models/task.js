const mongoose = require("mongoose")

const Tasks = mongoose.model("Task", {
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
})


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