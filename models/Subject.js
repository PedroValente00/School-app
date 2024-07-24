const mongoose = require('mongoose');
const { Schema } = mongoose;
require('dotenv').config();
const {USER, PASSWORD} = process.env;
const database = `mongodb+srv://${USER}:${PASSWORD}@school-cluster.agwze2v.mongodb.net/?retryWrites=true&w=majority&appName=school-cluster`;
mongoose.connect(database);

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