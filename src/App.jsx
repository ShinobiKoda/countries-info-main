import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CountryApp from "./CountryApp";
import CountryDetail from "./CountryDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CountryApp />} />
        <Route path="/country/:name" element={<CountryDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
