const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    // Don't exit the process here, just log the error
  });

// Add routes here
const chatRouter = require("./route/chat");
app.use("/api", chatRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
