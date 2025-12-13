import React from "react";
import { useNavigate } from "react-router-dom";
import "./App.css"; 
import logo from "./assets/logo.png"
export default function WelcomePage() {
const navigate = useNavigate();

    return (
    <div >
      <img src={logo} alt="logo" style={{height: 600 , width: 600}}/>
      <h1 style={{color: "black"}}>AI CAREER HELPER</h1>
      <p style={{color: "black"}}>Unlock Your Potential. Guide Your Future.</p>
      <button onClick = {() => navigate("/Chat")} >GET STARTED</button>
    </div>
  );
}