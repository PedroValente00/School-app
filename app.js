const express = require("express");
const app = express();
const path = require("path");
const Teacher = require("./models/Teacher");
const Subject = require("./models/Subject");
const Student = require("./models/Student");
const catchAsync = require("./utils/catchAsync");
const methodOverride = require("method-override");

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.json())

app.get("/", (req, res) => {
    res.render("landing-page");
});

app.get("/teachers", catchAsync(async (req, res, next) => {
    const teachers = await Teacher.find()
        .populate("subjects");
    res.render("teachers", { teachers })
}))

app.post("/teachers", catchAsync(async (req, res, next) => {
    const { firstName, lastName, email, message } = req.body;
    if (!(firstName && lastName && email && message)) {
        return res.render("teachers/new", { err: "err" })
    }
    const newTeacher = new Teacher({ firstName, lastName, email, message });
    await newTeacher.save();
    const teacher = await Teacher.findById(newTeacher._id);
    res.redirect(`/teachers/${teacher._id}`)
}))

app.get("/teachers/new", (req, res) => {
    res.render("teachers/new")
})

app.get("/teachers/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const teacher = await Teacher.findById(id)
        .populate("subjects");
    res.render("teachers/teacher", { teacher });
}))


app.get("/teachers/:id/edit", catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const teacher = await Teacher.findById(id);
    if (!teacher) return next("Could not find this person.");
    res.render("teachers/edit", { teacher })
}))

app.put("/teachers/:id", catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { firstName, lastName, email, message } = req.body;
    await Teacher.findByIdAndUpdate(id, { firstName, lastName, email, message })
    res.redirect(`/teachers/${id}`)
}))

app.delete("/teachers/:id", catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Teacher.findByIdAndDelete(id, { runValidators: true })
    res.redirect("/teachers")
}))

//-----------------------------------

app.get("/students", catchAsync(async (req, res, next) => {
    const students = await Student.find()
        .populate("subjects");
    res.render("students", { students })
}))

app.post("/students", catchAsync(async (req, res, next) => {
    const { firstName, lastName, email, message } = req.body;
    if (!(firstName && lastName && email && message)) {
        return res.render("students/new", { err: "err" })
    }
    const newStudent = new Student({ firstName, lastName, email, message });
    await newStudent.save();
    const student = await Student.findById(newStudent._id);
    res.redirect(`/students/${student._id}`)
}))

app.get("/students/new", (req, res) => {
    res.render("students/new")
})

app.get("/students/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const student = await Student.findById(id)
        .populate("subjects");
    res.render("students/student", { student });
}))


app.get("/students/:id/edit", catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const student = await Student.findById(id);
    if (!student) return next("Could not find this student.");
    res.render("students/edit", { student })
}))

app.put("/students/:id", catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { firstName, lastName, email, message } = req.body;
    await Student.findByIdAndUpdate(id, { firstName, lastName, email, message })
    res.redirect(`/students/${id}`)
}))

app.delete("/students/:id", catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Student.findByIdAndDelete(id, { runValidators: true })
    res.redirect("/students")
}))


// ----------------------------------

app.get("/subjects", catchAsync(async (req, res, next) => {
    const subjects = await Subject.find();
    res.render("subjects", { subjects })
}))

app.post("/subjects", catchAsync(async (req, res, next) => {
    const { name, description } = req.body;
    if (!(name && description)) {
        return res.render("subjects/new", { err: "err" })
    }
    const newSubject = new Subject({ name, description });
    await newSubject.save();
    const subject = await Subject.findById(newSubject._id);
    res.redirect(`/subjects/${subject._id}`)
}))

app.get("/subjects/new", (req, res) => {
    res.render("subjects/new")
})

app.get("/subjects/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const subject = await Subject
        .findById(id)
        .populate(["students", "teacher"])
    res.render("subjects/subject", { subject });
}))

app.get("/subjects/:id/edit", catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const subject = await Subject.findById(id);
    if (!subject) return next("Could not find this class.");
    res.render("subjects/edit", { subject })
}))

app.put("/subjects/:id", catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { name, description } = req.body;
    await Subject.findByIdAndUpdate(id, { name, description })
    res.redirect(`/subjects/${id}`)
}))

app.delete("/subjects/:id", catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Subject.findByIdAndDelete(id, { runValidators: true })
    res.redirect("/subjects")
}))

app.get("/subjects/:id/enroll", catchAsync(async (req, res) => {
    const { id } = req.params;
    const teachers = await Teacher.find()
    const students = await Student.find().populate("subjects");
    const subject = await Subject.findById(id).populate("teacher");
    res.render("subjects/enroll", { subject, teachers, students })
}))

app.put("/subjects/:id/enroll", catchAsync(async (req, res) => {
    const { id } = req.params;
    const { teacherID, studentID } = req.body;
    const subject = await Subject.findById(id);
    subject.teacher = teacherID;
    subject.students = studentID;
    const studentsArr = typeof studentID === "string" ? Array(studentID) : studentID;

    // step 1/2: find all students and if this subject is already registered, remove it
    const students = await Student.find();
    for (student of students) {
        let match = student.subjects.includes(subject._id)
        if (match) {
            const index = student.subjects.indexOf(match);
            student.subjects.splice(index, 1)
            await student.save()
        }
    }

    // step 2/2: then register this subject on the students submitted
    if (studentsArr) {
        for (each of studentsArr) {
            const student = await Student.findById(each)
            student.subjects.push(subject._id)
            await student.save()
        }
    }

    // do the same for the teacher 

    const teachersArr = typeof teacherID === "string" ? Array(teacherID) : teacherID;
    const teachers = await Teacher.find();
    for (teacher of teachers) {
        let match = teacher.subjects.includes(subject._id)
        if (match) {
            const index = teacher.subjects.indexOf(match);
            teacher.subjects.splice(index, 1)
            await teacher.save()
        }
    }

    if (teachersArr) {
        for (each of teachersArr) {
            const teacher = await Teacher.findById(each)
            teacher.subjects.push(subject._id)
            await teacher.save()
        }
    }

    await subject.save()
    res.redirect(`/subjects/${id}`)
}))

// ----------------------------------
app.get("/whoops", (req, res) => {
    res.render("whoops")
})

app.use((err, req, res, next) => {
    console.error(err)
    res.status(500).redirect("/whoops")
})

app.get("/:whatever", (req, res) => {
    res.status(404).render("missing")
})

app.listen(3000, () => {
    console.log("--server started--")
})