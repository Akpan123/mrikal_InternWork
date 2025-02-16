import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/Homepage";
import EditorPage from "./components/EditorPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/docs/:id" element={<EditorPage />} />
      </Routes>
    </Router>
  );
}
