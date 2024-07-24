const mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.connect('mongodb://127.0.0.1:27017/staff');

const studentSchema = new Schema({
    firstName: {
        required: [true, "First name is required but is missing."],
        type: String
    },
    lastName: {
        required: [true, "Last name is required but is missing."],
        type: String
    },
    email: {
        required: [true, "Email is required but is missing."],
        type: String
    },
    message: {
        required: [true, "A message/greeting is required but is missing."],
        type: String
    },
    subjects: [{type: Schema.Types.ObjectId, ref: "Subject"}]
})

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;