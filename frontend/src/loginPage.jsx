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
  Input,
  FormHelperText,
} from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Box flex={1} justifyContent={"center"} alignItems="center" display="flex" flexDirection="column" gap={2}>
      <Box
        component="img"
        src={logo}
        alt="logo"
        style={{ height: 400, width: 400 }}
      />
      <Typography color="black" variant="h3" fontWeight={700}>
        Welcome Back!
      </Typography>
      <Typography color="black" variant="subtitle1" fontWeight={700}>
        Log in to unlock your potential.
      </Typography>
      <Box sx={{flexDirection: 'column', display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
        <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
          <InputLabel>Email</InputLabel>
          <OutlinedInput
            endAdornment={<InputAdornment position="end" />}
            label="Email"
          />
        </FormControl>
        <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
          <InputLabel>Password</InputLabel>
          <OutlinedInput
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
            label="Password"
          />
        </FormControl>
        <Button variant="contained" onClick = {() => navigate("/Chat")}>Log In</Button>
      </Box>
    </Box>
  );
}
