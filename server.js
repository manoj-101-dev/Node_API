import express from "express";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

mongoose.connect("mongodb://localhost:27017/mentor_db", {});

const mentorSchema = new mongoose.Schema({
  name: String,
  expertise: String,
});

const Mentor = mongoose.model("Mentor", mentorSchema);

const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  grade: String,
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mentor",
  },
});

const Student = mongoose.model("Student", studentSchema);

// Create Mentor API
app.post("/mentors", async (req, res) => {
  try {
    const { name, expertise } = req.body;
    const newMentor = new Mentor({ name, expertise });
    const createdMentor = await newMentor.save();
    res.status(201).json(createdMentor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all mentors
app.get("/mentors", async (req, res) => {
  try {
    const mentors = await Mentor.find();
    res.status(200).json(mentors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create Student API
app.post("/students", async (req, res) => {
  try {
    const { name, age, grade } = req.body;
    const newStudent = new Student({ name, age, grade });
    const createdStudent = await newStudent.save();
    res.status(201).json(createdStudent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all students
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

///// assign a mentor to a student
app.put("/students/:studentId/assign-mentor/:mentorId", async (req, res) => {
  try {
    const { studentId, mentorId } = req.params;

    // Find the student by ID
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Find the mentor by ID
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    // Assign the mentor to the student
    student.mentor = mentorId;
    await student.save();

    res
      .status(200)
      .json({ message: `Student ${studentId} assigned to Mentor ${mentorId}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
///// Add multiple students to a mentor
app.put("/mentors/:mentorId/add-students", async (req, res) => {
  try {
    const { mentorId } = req.params;
    const { studentIds } = req.body;

    // Find the mentor by ID
    let mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    // Ensure the mentor object has a students array or initialize it if undefined
    if (!mentor.students) {
      mentor.students = [];
    }

    // Filter out students who are already associated with a mentor
    const studentsToAdd = await Student.find({
      _id: { $in: studentIds },
      mentor: { $exists: false }, // Exclude students with a mentor
    });

    // Add new students to the mentor's students array
    mentor.students.push(...studentsToAdd.map((student) => student._id));

    // Save the updated mentor object
    await mentor.save();

    res.status(200).json({ message: "Students added to mentor successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//// Get all students without a mentor
app.get("/students/without-mentor", async (req, res) => {
  try {
    const studentsWithoutMentor = await Student.find({
      mentor: { $exists: false },
    });
    res.status(200).json(studentsWithoutMentor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Assign or change mentor for a particular student
app.put("/students/:studentId/assign-mentor/:mentorId", async (req, res) => {
  try {
    const { studentId, mentorId } = req.params;

    // Find the student by ID
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Find the mentor by ID
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    // Assign or change the mentor for the student
    student.mentor = mentorId;
    await student.save();

    res
      .status(200)
      .json({ message: `Student ${studentId} assigned to Mentor ${mentorId}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//// Show all students for a particular mentor
app.get("/mentors/:mentorId/students", async (req, res) => {
  try {
    const { mentorId } = req.params;

    // Find the mentor by ID
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    // Find all students associated with the mentor
    const students = await Student.find({ mentor: mentorId });

    // Extract only necessary fields for the response
    const formattedStudents = students.map((student) => ({
      _id: student._id,
      name: student.name,
      age: student.age,
      grade: student.grade,
    }));

    res.status(200).json(formattedStudents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Show previously assigned mentor for a particular student
app.get("/students/:studentId/previous-mentor", async (req, res) => {
  try {
    const { studentId } = req.params;

    // Find the student by ID
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Check if the student has a mentor assigned
    if (!student.mentor) {
      return res
        .status(200)
        .json({ message: "Student has no previous mentor" });
    }

    // Find the previous mentor by ID
    const previousMentor = await Mentor.findById(student.mentor);
    if (!previousMentor) {
      return res.status(404).json({ error: "Previous mentor not found" });
    }

    res.status(200).json(previousMentor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
