import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


import Chat from "./components/Chat";

import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
    
        <Routes>
     
          <Route path="/" element={<Chat />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
