import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ContactMe from "./pages/ContactMe";
import RecipePage from "./pages/RecipePage";

function App() {
  return (
    <Router>
      <Navbar />
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
