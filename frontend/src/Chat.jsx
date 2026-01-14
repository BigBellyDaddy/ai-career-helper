import { useState } from "react";
import { useNavigate } from "react-router-dom";
import chatlogo from "./assets/chatlogo.png";
import {
  Box,
  Typography,
  Button,
  Divider,
  Input,
  TextField,
  Drawer,
  Toolbar,
  AppBar,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";

const drawerWidth = 250;
export default function Chat() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box flex={1} backgroundColor="white">
      {/*Drawer*/}
      <AppBar
        position="fixed"
        sx={{
          bgcolor: "white",
          color: "black",
          boxShadow: 1,
          width: open ? `calc(100% - ${drawerWidth}px)` : "100%",
          ml: open ? `${drawerWidth}px` : 0,
          transition: "all 200ms ease",
        }}
      >
        <Toolbar>
          {!open && (
            <MenuIcon
              onClick={handleDrawerOpen}
              sx={{ cursor: "pointer", marginRight: 2, color: "black" }}
            />
          )}

          <Typography
            color="black"
            variant="h6"
            textAlign="center"
            sx={{ pt: "4px" }}
          >
            AI Career Helper
          </Typography>
        </Toolbar>

        {/* Drawer Component */}
        <Drawer
          variant="persistent"
          anchor="left"
          open={open}
          onClose={handleDrawerClose}
        >
          <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={handleDrawerClose}
            onKeyDown={handleDrawerClose}
          >
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <IconButton
                onClick={handleDrawerClose}
                sx={{ my: "12px", mr: "20px" }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            <Divider />

            {/* Drawer Buttons */}
            <Button
              sx={{ fontSize: 20, color: "black" }}
              fullWidth
              onClick={() => navigate("/")}
            >
              <Box sx={{ width: "100%", textAlign: "left", ml: 10 }}>Home</Box>
            </Button>
            <Button
              sx={{ fontSize: 20, color: "black" }}
              fullWidth
              onClick={() => navigate("/chat")}
            >
              <Box sx={{ width: "100%", textAlign: "left", ml: 10 }}>Chat</Box>
            </Button>

            <Button
              sx={{ fontSize: 20, color: "black" }}
              fullWidth
              onClick={() => navigate("/roadmap")}
            >
              <Box sx={{ width: "100%", textAlign: "left", ml: 10 }}>
                RoadMap
              </Box>
            </Button>
          </Box>
        </Drawer>
      </AppBar>
    </Box>
  );
}
