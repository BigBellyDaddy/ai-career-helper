import React from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import logo from "./assets/logo.png";
import { Button, Box, Typography } from "@mui/material";

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Box
        component="img"
        src={logo}
        alt="logo"
        sx={{ maxWidth: 600, maxHeight: 600, alignSelf: "center" }}
      />
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography color="black" variant="h3" fontWeight={700}>
          AI CAREER HELPER
        </Typography>

        <Typography variant="subtitle1" color="text.secondary">
          Unlock Your Potential. Guide Your Future.
        </Typography>
      </Box>

      <Button
        variant="contained"
        size="large"
        sx={{
          mt: 1,
          borderRadius: 3,
          textTransform: "none",
          fontWeight: 700,
          py: 1.2,
          width: 200,
          alignSelf: "center",
        }}
        onClick={() => navigate("/loginPage")}
      >
        {" "}
        GET STARTED
      </Button>
    </Box>
  );
}
