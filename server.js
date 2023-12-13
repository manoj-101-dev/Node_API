import express from "express";
import { mentorRouter } from "./routes/mentors.js";
import { studentRouter } from "./routes/students.js";
import { assignmentRouter } from "./routes/assignments.js";
import { connectToDatabase } from "./db.js";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Connect to the MongoDB database
connectToDatabase();

// Routes
app.use("/mentors", mentorRouter);
app.use("/students", studentRouter);
app.use("/assignments", assignmentRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
