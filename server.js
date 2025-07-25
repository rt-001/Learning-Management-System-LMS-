const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const rateLimiter = require("./middlewares/rateLimiter");
dotenv.config();
const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/courses");
const lessonRoutes = require("./routes/lessons");
const quizRoutes = require("./routes/quizzes");
const progressRoutes = require("./routes/progress");
const app = express();
app.use(express.json());
app.use(rateLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/progress", progressRoutes);
const PORT = process.env.PORT || 8000;
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error("MONGO_URI missing");
  process.exit(1);
}
mongoose.set("strictQuery", true);
mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("DB connection error:", err);
    process.exit(1);
  });
