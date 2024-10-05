import React, { useState, useEffect } from "react";
import axios from "axios";
import './Chat.css'; // Import the new CSS file for animations

const CHARACTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_=~!@#$%^&*/\\|;:?"

const randomCharacter = () => {
  return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
};

const generateRandomString = (length) => {
  return Array(length).fill().map(randomCharacter).join("");
};

function Chat() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isCopyHovered, setIsCopyHovered] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [letters, setLetters] = useState("");

  useEffect(() => {
    const container = document.querySelector(".container");
    let intervalId;

    const updateLetters = () => {
      const fontSize = Number(window.getComputedStyle(container).getPropertyValue('font-size').match(/\d+/)[0]);
      const characterCount = Math.floor((container.clientWidth / (fontSize / 1.8)) * (container.clientHeight / fontSize));
      setLetters(generateRandomString(characterCount));
    };

    const handleMouseMove = (e) => {
      const bounds = container.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const y = e.clientY - bounds.top;

      // Set position for radial gradient
      container.style.setProperty("--x", `${x}px`);
      container.style.setProperty("--y", `${y}px`);

      // Update letters opacity
      container.querySelector('.letters').style.opacity = '0.4';
    };

    const handleMouseLeave = () => {
      setLetters("");
      container.querySelector('.letters').style.opacity = '0';
    };

    // Start the interval to update letters
    intervalId = setInterval(updateLetters, 500); // Update every 500ms

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearInterval(intervalId); // Clear the interval on component unmount
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse(""); // Clear previous response
    try {
      const res = await axios.post("/api/chat", { message: input });
      setResponse(res.data.response);
      setInput("");
    } catch (error) {
      console.error("Error:", error);
      setResponse("An error occurred while generating a response.");
    }
    setIsLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }, (err) => {
      console.error('Failed to copy text: ', err);
    });
  };

  return (
    <div className="container">
      <div className="letters" style={{ opacity: 0 }}>{letters}</div>
      <div className="components">
        <h2>AI Assistant </h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about anything, request code, or inquire about web development and cybersecurity"
            rows="4"
          />
          <button  className="btn-submit" type="submit" disabled={isLoading}>
            {isLoading ? "Searching..." : "Submit"}
          </button>
        </form>
        {response && (
          <div className="response">
            <h3>Response:</h3>
            <pre>{response}</pre>
            <button onClick={handleCopy}>
              {copySuccess ? "Copied!" : "Copy Response"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;


