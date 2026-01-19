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
  Avatar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import SendIcon from "@mui/icons-material/Send";
import LogoutIcon from "@mui/icons-material/Logout";
import Delete from "@mui/icons-material/Delete";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import {
  upsertUserProfile,
  createChat,
  loadChats,
  loadMessages,
  saveMessage,
  deleteChat,
  updateChatTitle,
  saveRoadmap,
} from "./db/chatDb";

const drawerWidth = 250;

export default function Chat() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [chats, setChats] = useState([]);
  const [input, setInput] = useState("");
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);
  const [roadmapError, setRoadmapError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const init = async () => {
      // user UID
      await upsertUserProfile(user);

      // Users chats
      const list = await loadChats(user.uid);
      setChats(list);

      // Active Chat
      const savedChatId = localStorage.getItem("activeChatId");

      let active = savedChatId;

      // New Chat if we hadnt
      if (!active) {
        active = await createChat(user.uid, "Pierwszy czat");
        localStorage.setItem("activeChatId", active);
      }

      setChatId(active);

      // Upload chats messeges
      const msgs = await loadMessages(user.uid, active);

      // msg to ui
      if (msgs.length > 0) {
        setMessages(
          msgs.map((m) => ({
            id: m.id,
            role: m.role,
            content: m.content,
            ts: m.ts,
          })),
        );
      } else {
        // przeszle powiadominie jezeli nie mamy nowych
        setMessages([
          {
            id: 1,
            role: "assistant",
            content: "Część! Jakie masz pytania związane z karierą?",
            ts: Date.now(),
          },
        ]);
      }
    };

    init();
  }, [user]);

  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content: "Część? Jakie masz pytania związane z karierą?",
      ts: Date.now(),
    },
  ]);

  //OPEN DRAWER|CLOSE DRAWER
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

  //TIME FORMATING
  const formatTime = (ts) =>
    new Intl.DateTimeFormat("pl-PL", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(ts);

  //CLEAR HISTORY FOR BACKEND
  const compactHistory = (arr) =>
    arr.map(({ role, content }) => ({ role, content }));

  //SENDING MESSAGE
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
    setIsTyping(true);

    const clearHistory = compactHistory(updatedHistory);

    if (user && chatId) {
      await saveMessage(user.uid, chatId, "user", text);

      const currentChat = chats.find((c) => c.id === chatId);

      //rename only one-time
      if (currentChat?.title === "Nowy czat") {
        const newTitle = text.slice(0, 30);
        await updateChatTitle(user.uid, chatId, newTitle);

        const list = await loadChats(user.uid);
        setChats(list);
      }
    }

    try {
      const res = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: clearHistory,
        }),
      });

      const data = await res.json();

      const botMsg = {
        id: nextIdRef.current++,
        role: "assistant",
        content: data.reply,
        ts: Date.now(),
      };

      if (user && chatId) {
        await saveMessage(user.uid, chatId, "assistant", data.reply);
      }

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
    } finally {
      setIsTyping(false);
    }
  };

  // ROADMAP GENERATION
  const generateRoadmap = async () => {
    try {
      setLoadingRoadmap(true);
      setRoadmapError(null);

      if (!user || !chatId) {
        setRoadmapError("Nie wybrano aktywnego czatu.");
        return;
      }

      const cleanHistory = compactHistory(messages);

      const res = await fetch("http://localhost:3001/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: cleanHistory }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "RoadMap generation failed");
      }

      const roadmapToSave = data.roadmap ?? data;
      const roadmapId = await saveRoadmap(user.uid, chatId, roadmapToSave);

      navigate("/roadmap", {
        state: {
          chatId,
          roadmapId,
          roadmap: roadmapToSave,
        },
      });
    } catch (e) {
      setRoadmapError(
        "Nie udało się wygenerować ścieżki kariery: " + e.message,
      );
    } finally {
      setLoadingRoadmap(false);
    }
  };

  //JSX
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
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
            <IconButton onClick={handleDrawerClose} sx={{ m: 1 }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider />

          <Box
            sx={{
              justifyContent: "center",
              display: "flex",
              alignItems: "center",

              gap: 1,
              mb: 0.7,
            }}
          >
            {/* przycisk nowego chatu */}
            <Button
              fullWidth
              variant="contained"
              sx={{
                maxWidth: 225,
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 700,
              }}
              onClick={async () => {
                if (!user) return;

                // nowy chat
                const newId = await createChat(user.uid, "Nowy czat");

                // zrobić go aktywnym
                localStorage.setItem("activeChatId", newId);
                setChatId(newId);

                // czysty UI pod czat
                setMessages([
                  {
                    id: 1,
                    role: "assistant",
                    content: "Część? Jakie masz pytania związane z karierą?",
                    ts: Date.now(),
                  },
                ]);

                // lista drawera
                const list = await loadChats(user.uid);
                setChats(list);
              }}
            >
              + New Chat
            </Button>
          </Box>
          {/* chaty  */}
          <Box sx={{ p: 1 }}>
            {chats.length === 0 ? (
              <Typography
                sx={{ fontSize: 13, color: "text.secondary", px: 1, py: 1 }}
              >
                Brak czatów
              </Typography>
            ) : (
              chats.map((c) => (
                <Box
                  key={c.id}
                  sx={{
                    px: 0.5,
                    display: "flex",
                    alignItems: "center",

                    gap: 1,
                    mb: 0.7,
                  }}
                >
                  <Button
                    fullWidth
                    variant={c.id === chatId ? "outlined" : "text"}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      textTransform: "none",
                      borderRadius: 3,
                      fontWeight: 700,
                      pr: 1,
                      pl: 1.5,
                    }}
                    onClick={async () => {
                      if (!user) return;

                      setChatId(c.id);
                      localStorage.setItem("activeChatId", c.id);

                      const msgs = await loadMessages(user.uid, c.id);

                      if (msgs.length > 0) {
                        setMessages(
                          msgs.map((m) => ({
                            id: m.id,
                            role: m.role,
                            content: m.content,
                            ts: m.ts,
                          })),
                        );
                      } else {
                        setMessages([
                          {
                            id: 1,
                            role: "assistant",
                            content:
                              "Część? Jakie masz pytania związane z karierą?",
                            ts: Date.now(),
                          },
                        ]);
                      }

                      setOpen(false);
                    }}
                  >
                    <Box
                      sx={{
                        flexGrow: 1,
                        textAlign: "left",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {c.title || "Chat"}
                    </Box>

                    <IconButton
                      size="small"
                      title="Usuń czat"
                      onClick={async (e) => {
                        e.stopPropagation();

                        if (!user) return;

                        const ok = window.confirm(
                          "Czy na pewno chcesz usunąć ten czat?",
                        );
                        if (!ok) return;

                        await deleteChat(user.uid, c.id);

                        if (c.id === chatId) {
                          localStorage.removeItem("activeChatId");

                          const newId = await createChat(user.uid, "Nowy czat");
                          localStorage.setItem("activeChatId", newId);
                          setChatId(newId);

                          setMessages([
                            {
                              id: 1,
                              role: "assistant",
                              content:
                                "Część? Jakie masz pytania związane z karierą?",
                              ts: Date.now(),
                            },
                          ]);
                        }

                        const list = await loadChats(user.uid);
                        setChats(list);
                      }}
                      sx={{ flexShrink: 0 }}
                    >
                      <Delete />
                    </IconButton>
                  </Button>
                </Box>
              ))
            )}
          </Box>

          <Divider sx={{ my: 1 }} />
          <Box
            sx={{
              justifyContent: "center",
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 0.7,
            }}
          >
            <Button
              fullWidth
              variant="outlined"
              sx={{
                maxWidth: 225,
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 800,
              }}
              onClick={() => navigate("/roadmap")}
            >
              RoadMap
            </Button>
          </Box>
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
          <Toolbar>
            {!open && (
              <MenuIcon
                onClick={handleDrawerOpen}
                sx={{ cursor: "pointer", mr: 2, color: "black" }}
              />
            )}
            <Typography variant="h6">AI Career Helper</Typography>

            {user && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  ml: "auto",
                  gap: 1,
                }}
              >
                <Button
                  variant="contained"
                  onClick={generateRoadmap}
                  disabled={loadingRoadmap || messages.length <= 6}
                  sx={{
                    textTransform: "none",
                    borderRadius: 3,
                    fontWeight: 700,
                    mr: 1,
                  }}
                >
                  {loadingRoadmap ? "Generating..." : "Generate Roadmap"}
                </Button>
                <Typography sx={{ fontWeight: 700, fontSize: 14 }}>
                  {user.displayName || "Użytkownik"}
                </Typography>

                <Avatar
                  src={user.photoURL || ""}
                  alt={user.displayName || "User"}
                  sx={{ width: 34, height: 34 }}
                />

                <IconButton
                  onClick={() => signOut(auth)}
                  sx={{ ml: 0.5 }}
                  title="Wyloguj"
                >
                  <LogoutIcon />
                </IconButton>
              </Box>
            )}
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

            {isTyping && (
              <Box
                sx={{ display: "flex", justifyContent: "flex-start", mb: 1.5 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    px: 2,
                    py: 1.2,
                    borderRadius: 3,
                    bgcolor: "#ECEFF4",
                    color: "#111827",
                    border: "1px solid #E5E7EB",
                    maxWidth: 220,
                  }}
                >
                  <Typography sx={{ fontSize: 14.5, fontWeight: "bold" }}>
                    AI pisze...
                  </Typography>
                </Paper>
              </Box>
            )}

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
