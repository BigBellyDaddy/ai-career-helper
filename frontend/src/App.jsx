import { BrowserRouter, Routes, Route } from "react-router-dom";
import Chat from "./Chat.jsx";
import WelcomePage from "./welcomePage.jsx";
import LoginPage from "./loginPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/Chat" element={<Chat />} />
        <Route path="/loginPage" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}
