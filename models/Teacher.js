const mongoose = require('mongoose');
const { Schema } = mongoose;
require('dotenv').config();
const {USER, PASSWORD} = process.env;
const database = `mongodb+srv://${USER}:${PASSWORD}@school-cluster.agwze2v.mongodb.net/?retryWrites=true&w=majority&appName=school-cluster`;
mongoose.connect(database);

const teacherSchema = new Schema({
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

const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;