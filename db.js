import mongoose from "mongoose";

export const connectToDatabase = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/mentor_db", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit process with failure
  }
};
