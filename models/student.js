import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  grade: String,
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mentor",
  },
});

export const Student = mongoose.model("Student", studentSchema);
