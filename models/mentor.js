import mongoose from "mongoose";

const mentorSchema = new mongoose.Schema({
  name: String,
  expertise: String,
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
});

export const Mentor = mongoose.model("Mentor", mentorSchema);
