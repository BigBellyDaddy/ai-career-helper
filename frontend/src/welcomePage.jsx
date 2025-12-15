import React from "react";
import { useNavigate } from "react-router-dom";
import "./App.css"; 
import logo from "./assets/logo.png"
import { Button,Box,Typography } from '@mui/material';

export default function WelcomePage() {
const navigate = useNavigate();

    return (
    <Box>
      <Box component="img" src={logo} alt="logo" sx={{width: 600, height: 600}}/>
      <Typography color="black" variant="h3" fontWeight={700}>
        AI CAREER HELPER
      </Typography>

      <Typography variant="subtitle1" color="text.secondary">
        Unlock Your Potential. Guide Your Future.
      </Typography>
      <Button variant="contained" onClick = {() => navigate("/loginPage")} > GET STARTED</Button>
    </Box>
  );
}