import express from "express";
import { Mentor } from "../models/mentor.js";
import { Student } from "../models/student.js";

export const assignmentRouter = express.Router();

// Assign a mentor to a student
assignmentRouter.put(
  "/:studentId/assign-mentor/:mentorId",
  async (req, res) => {
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

      res.status(200).json({
        message: `Student ${studentId} assigned to Mentor ${mentorId}`,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Add multiple students to a mentor
assignmentRouter.put("/:mentorId/add-students", async (req, res) => {
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

// Get all students without a mentor
assignmentRouter.get("/students/without-mentor", async (req, res) => {
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
assignmentRouter.put(
  "/:studentId/assign-mentor/:mentorId",
  async (req, res) => {
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

      res.status(200).json({
        message: `Student ${studentId} assigned to Mentor ${mentorId}`,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Show all students for a particular mentor
assignmentRouter.get("/:mentorId/students", async (req, res) => {
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
assignmentRouter.get("/:studentId/previous-mentor", async (req, res) => {
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
