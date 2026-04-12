import { BrowserRouter, Routes, Route } from "react-router-dom";
import Game from "./pages/Game";
import Verify from "./pages/Verify";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Game />} />
        <Route path="/verify" element={<Verify />} />
      </Routes>
    </BrowserRouter>
  );
}
