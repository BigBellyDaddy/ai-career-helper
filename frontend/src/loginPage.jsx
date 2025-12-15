import React from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import logo from "./assets/logo.png";
export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div>
      <img src={logo} alt="logo" style={{ height: 400, width: 400 }} />
      <h1 style={{ color: "black" }}>Welcome Back</h1>
      <p style={{ color: "black" }}>Log in to unlock your potential.</p>
      <div jus>
        <input type="email" placeholder="Email Address" />
        <input type="password" placeholder="Password" />
      </div>
    </div>
  );
}
