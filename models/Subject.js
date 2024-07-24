const mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.connect('mongodb://127.0.0.1:27017/staff');

const subjectSchema = new Schema({
    name: {
        required: [true, "Name is required but is missing."],
        type: String
    },
    description: {
        required: [true, "Description is required but is missing."],
        type: String
    },
    teacher: {type: Schema.Types.ObjectId, ref: "Teacher"},
    students: [{type: Schema.Types.ObjectId, ref: "Student"}]
})

const Subject = mongoose.model("Subject", subjectSchema);

module.exports = Subject;