import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Divider,
  TextField,
  Drawer,
  Toolbar,
  AppBar,
  IconButton,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import SendIcon from "@mui/icons-material/Send";

const drawerWidth = 250;

export default function Chat() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content: "Część? Jakie masz pytania związane z karierą?",
      ts: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");

  const [loadingRoadmap, setLoadingRoadmap] = useState(false);
  const [roadmapError, setRoadmapError] = useState(false);

  //Open/Close Drawer
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const listRef = useRef(null);
  const nextIdRef = useRef(2);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  //Time formatting
  const formatTime = (ts) =>
    new Intl.DateTimeFormat("pl-PL", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(ts);

  {
    /* Chat request handling */
  }
  const sendMessage = async () => {
    const text = input.trim();
    if (!input.trim()) return;

    const userMsg = {
      id: nextIdRef.current++,
      role: "user",
      content: text,
      ts: Date.now(),
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInput("");

    try {
      const res = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: updatedHistory,
        }),
      });

      const data = await res.json();

      const botMsg = {
        id: nextIdRef.current++,
        role: "assistant",
        content: data.reply,
        ts: Date.now(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: nextIdRef.current++,
          role: "assistant",
          content: "Wystąpił błąd serwera.",
          ts: Date.now(),
        },
      ]);
    }
  };

  const generateRoadmap = async () => {
    try {
      setLoadingRoadmap(true);
      setRoadmapError(null);

      const res = await fetch("http://localhost:3001/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: messages }),
      });

      const data = await res.json();

      const roadmapToSave = data.roadmap ?? data;

      localStorage.setItem("roadmap", JSON.stringify(roadmapToSave));
      navigate("/roadmap", { state: roadmapToSave });
    } catch (e) {
      setRoadmapError(
        "Nie udało się wygenerować ścieżki kariery: " + e.message
      );
    } finally {
      setLoadingRoadmap(false);
    }
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", bgcolor: "#fff" }}>
      {/* Drawer */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        onClose={handleDrawerClose}
        sx={{
          "& .MuiDrawer-paper": { width: drawerWidth },
        }}
      >
        <Box sx={{ width: drawerWidth }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end" , mb: 1 }}>
            <IconButton onClick={handleDrawerClose} sx={{ m: 1 }}>
              <CloseIcon />
            </IconButton>
          </Box >
          <Divider />

          <Button  fullWidth onClick={() => navigate("/")}>
            Home
          </Button>
          <Button fullWidth onClick={() => navigate("/chat")}>
            Chat
          </Button>
          <Button fullWidth onClick={() => navigate("/roadmap")}>
            RoadMap
          </Button>
        </Box>
      </Drawer>

      {/* Chat */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          ml: open ? `${drawerWidth}px` : 0,
          transition: "margin 200ms ease",
        }}
      >
        {/* TOP BAR */}
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
          <Toolbar >
            {!open && (
              <MenuIcon
                onClick={handleDrawerOpen}
                sx={{ cursor: "pointer", mr: 2, color: "black" }}
              />
            )}
            <Typography variant="h6">AI Career Helper</Typography>
          </Toolbar>
        </AppBar>
        <Toolbar />

        {/* MESSAGES  */}
        <Box
          ref={listRef}
          sx={{
            flex: 1,
            overflowY: "auto",
            px: { xs: 1.2, sm: 2.5, md: 3 },
            py: 2,
            bgcolor: "#f7f7f7",
          }}
        >
          <Box sx={{ maxWidth: 980, mx: "auto" }}>
            {messages.map((m) => {
              const isMe = m.role === "user";

              return (
                <Box
                  key={m.id}
                  sx={{
                    display: "flex",
                    justifyContent: isMe ? "flex-end" : "flex-start",
                    mb: 1.5,
                  }}
                >
                  <Box>
                    <Paper
                      elevation={0}
                      sx={{
                        px: 2,
                        py: 1.2,
                        borderRadius: 3,
                        bgcolor: isMe ? "#2F6BFF" : "#ECEFF4",
                        color: isMe ? "white" : "#111827",
                        border: isMe
                          ? "1px solid #2F6BFF"
                          : "1px solid #E5E7EB",
                        lineHeight: 1.35,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        maxWidth: "min(75vw, 520px)",
                      }}
                    >
                      <Typography sx={{ fontSize: 14.5, fontWeight: "bold" }}>
                        {m.content}
                      </Typography>
                    </Paper>

                    <Typography
                      sx={{
                        fontSize: 11,
                        color: "#6B7280",
                        mt: 0.4,
                        textAlign: isMe ? "right" : "left",
                        px: 0.5,
                      }}
                    >
                      {formatTime(m.ts)}
                    </Typography>
                  </Box>
                </Box>
              );
            })}

            {roadmapError && (
              <Typography sx={{ color: "red", mt: 1 }}>
                {roadmapError}
              </Typography>
            )}
          </Box>
        </Box>

        {/* INPUT */}
        <Box
          sx={{
            px: 2,
            py: 1.2,
            borderTop: "1px solid #E5E7EB",
            bgcolor: "white",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-end",
              gap: 1,
              px: 1.5,
              py: 1,
              borderRadius: 999,
              border: "1px solid #E5E7EB",
            }}
          >
            <TextField
              sx={{
                "& .MuiInputBase-input": {
                  fontWeight: "bold",
                },
              }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              variant="standard"
              fullWidth
              InputProps={{ disableUnderline: true }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <IconButton
              onClick={sendMessage}
              disabled={!input.trim()}
              sx={{ width: 44, height: 44 }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
