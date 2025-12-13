import React from "react";
import { useNavigate } from "react-router-dom";
import "./App.css"; 

export default function WelcomePage() {
const navigate = useNavigate();

    return (
    <div >
      <h1 >AI CAREER HELPER</h1>
      <p >Unlock Your Potential.Guide Your Future.</p>
      <button onClick = {() => navigate("/Chat")} >GET STARTED</button>
    </div>
  );
}