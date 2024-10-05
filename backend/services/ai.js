const { HfInference } = require("@huggingface/inference");

// Initialize Hugging Face Inference with a free API token
// You can get a free token by signing up at https://huggingface.co/
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

async function generateResponse(prompt) {
  try {
    console.log("Generating response for prompt:", prompt);

    const response = await hf.textGeneration({
      model: "bigscience/bloom",
      inputs: `You are a knowledgeable AI assistant capable of answering questions on any topic, including general knowledge, science, history, current events, technology, web development, cybersecurity, and more. You can also generate code when requested. Always strive to provide accurate and helpful information.
      Request: ${prompt}
      Response:`,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.7,
        top_p: 0.95,
        return_full_text: false,
        stop: ["Request:", "\n\n\n"]
      }
    });

    console.log("Full Hugging Face API response:", response);

    let generatedResponse = response.generated_text.trim();
    
    // If the response contains a code block, extract it
    const codeBlockMatch = generatedResponse.match(/```[\s\S]*?```/);
    if (codeBlockMatch) {
      generatedResponse = codeBlockMatch[0].replace(/```(\w+)?\n/, '').replace(/```$/, '');
    }

    return generatedResponse.trim();
  } catch (error) {
    console.error("Detailed error in generateResponse:", error);
    throw error;
  }
}

module.exports = {
  generateResponse,
};
