import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ContactMe from "./pages/ContactMe";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<ContactMe />} />
          <Route path="/recipes" element={<RecipePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
