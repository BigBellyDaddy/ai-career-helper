import React from "react";
import { useNavigate } from "react-router-dom";

export default function WelcomePage() {
const navigate = useNavigate();

    return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <h1>Welcome to AI Career Helper</h1>
      <p>Your personal assistant for career advice powered by AI.</p>
      <button onClick = {() => navigate("/Chat")} >AI Career Helper</button>
    </div>
  );
}