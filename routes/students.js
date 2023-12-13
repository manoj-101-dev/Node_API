import express from "express";
import { Student } from "../models/student.js";

export const studentRouter = express.Router();

// Create Student API
studentRouter.post("/", async (req, res) => {
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
studentRouter.get("/", async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Implement other Student related routes (if any)
