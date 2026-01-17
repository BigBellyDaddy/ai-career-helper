import { BrowserRouter, Routes, Route } from "react-router-dom";
import Chat from "./Chat.jsx";
import WelcomePage from "./welcomePage.jsx";
import LoginPage from "./loginPage.jsx";
import Roadmap from "./Roadmap.jsx";
import RequireAuth from "./RequireAuth.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/loginPage" element={<LoginPage />} />

        <Route
          path="/Chat"
          element={
            <RequireAuth>
              <Chat />
            </RequireAuth>
          }
        />

        <Route
          path="/roadmap"
          element={
            <RequireAuth>
              <Roadmap />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
