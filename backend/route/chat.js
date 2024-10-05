const express = require("express");
const router = express.Router();
const ai = require("../services/ai");

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    console.log("Received message:", message);
    const generatedResponse = await ai.generateResponse(message);
    console.log("Generated response:", generatedResponse);
    res.json({ response: generatedResponse });
  } catch (error) {
    console.error("Detailed server error:", error);
    let statusCode = 500;
    let errorMessage = "An error occurred while generating a response";

    if (error.response) {
      statusCode = error.response.status || 500;
      errorMessage = error.response.data.error || errorMessage;
    }

    res.status(statusCode).json({ 
      error: errorMessage,
      details: error.message,
      stack: process.env.NODE_ENV === 'production' ? undefined : error.stack
    });
  }
});

module.exports = router;
