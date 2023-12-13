import express from "express";
import { Mentor } from "../models/mentor.js";

export const mentorRouter = express.Router();

// Create Mentor API
mentorRouter.post("/", async (req, res) => {
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
mentorRouter.get("/", async (req, res) => {
  try {
    const mentors = await Mentor.find();
    res.status(200).json(mentors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Implement other Mentor related routes (if any)
