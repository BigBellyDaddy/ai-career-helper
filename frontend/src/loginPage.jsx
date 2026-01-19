import { useNavigate } from "react-router-dom";
import "./App.css";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import chatlogo from "./assets/chatlogo.png";
import GoogleIcon from "@mui/icons-material/Google";
import { Button, Box, Typography, Paper } from "@mui/material";

export default function LoginPage() {
  const navigate = useNavigate();

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/chat");
    } catch (e) {
      console.error(e);
    }
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
          src={chatlogo}
          alt="chatogo"
          sx={{
            width: "100%",
            maxWidth: 850,
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

          <Button
            variant="contained"
            size="large"
            fullWidth
            startIcon={<GoogleIcon />}
            sx={{
              borderRadius: 3,
              textTransform: "none",
              alignSelf: "center",
              fontWeight: 700,
              py: 1.2,
            }}
            onClick={loginWithGoogle}
          >
            Continue with Google
          </Button>
        </Paper>
      </Box>
    </Box>
  );
}
