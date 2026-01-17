import React from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

import logo from "./assets/logo.png";

import {
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  InputAdornment,
  OutlinedInput,
  IconButton,
  Paper,
} from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function LoginPage() {
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = React.useState(false);
 

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  
  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };


  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        bgcolor: "#F6F7FB",
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          justifyContent: "center",
          p: 4,
          bgcolor: "white",
          borderRight: "1px solid #E5E7EB",
        }}
      >
        <Box
          component="img"
          src={logo}
          alt="logo"
          sx={{
            width: "100%",
            maxWidth: 520,
            height: "auto",
            objectFit: "contain",
          }}
        />
        
      </Box>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 420,
            p: 4,
            borderRadius: 4,
            border: "1px solid #E5E7EB",
            bgcolor: "white",
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5 }}>
              Welcome Back!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Log in to unlock your potential.
            </Typography>
            
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Email</InputLabel>
              <OutlinedInput label="Email" type="email" />
            </FormControl>

            <FormControl fullWidth variant="outlined">
              <InputLabel>Password</InputLabel>
              <OutlinedInput
                label="Password"
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword ? "hide the password" : "display the password"
                      }
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      onMouseUp={handleMouseUpPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
             
            </FormControl>

            <Button
              variant="contained"
              size="large"
              sx={{
                mt: 1,
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 700,
                py: 1.2,
              }}
              onClick={() => {
                navigate("/Chat");
              }}
            >
              Log In
            </Button>
            
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}