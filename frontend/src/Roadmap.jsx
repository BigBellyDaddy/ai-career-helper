import { useEffect, useState } from "react";
import { Box, Typography, Button, Divider, Paper, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useLocation, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import { loadChats, loadRoadmaps, loadRoadmap, deleteRoadmap } from "./db/chatDb";

export default function Roadmap() {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [items, setItems] = useState([]); 
  const [selected, setSelected] = useState(null); 

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u || null));
    return () => unsub();
  }, []);

  // load all roadmaps
  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!user?.uid) return;

        const chats = await loadChats(user.uid);

        
        const all = [];
        for (const c of chats) {
          const rms = await loadRoadmaps(user.uid, c.id);
          for (const r of rms) {
            all.push({
              chatId: c.id,
              chatTitle: c.title || "Chat",
              roadmapId: r.id,
              roadmap: r,
            });
          }
        }

        setItems(all);

        //auto open chat to roadmap page
        const st = location.state || {};
        if (st.chatId && st.roadmapId) {
          const one = await loadRoadmap(user.uid, st.chatId, st.roadmapId);
          setSelected({
            chatId: st.chatId,
            roadmapId: st.roadmapId,
            roadmap: one,
            chatTitle: chats.find((x) => x.id === st.chatId)?.title || "Chat",
          });
          return;
        }

        //open new roadmap
        if (all.length > 0) {
          setSelected(all[0]);
        }
      } catch (e) {
        setError("Błąd ładowania roadmap: " + e.message);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [user, location.state]);

  const openItem = async (it) => {
    if (!user?.uid) return;
    const one = await loadRoadmap(user.uid, it.chatId, it.roadmapId);
    setSelected({ ...it, roadmap: one });
  };

  const handleDelete = async () => {
    if (!user?.uid || !selected) return;

    const ok = window.confirm("Usunąć ten roadmap?");
    if (!ok) return;

    await deleteRoadmap(user.uid, selected.chatId, selected.roadmapId);

    // delete from list
    setItems((prev) =>
      prev.filter(
        (x) => !(x.chatId === selected.chatId && x.roadmapId === selected.roadmapId),
      ),
    );

    // select next
    setSelected((prevSelected) => {
      const rest = items.filter(
        (x) =>
          !(x.chatId === prevSelected.chatId && x.roadmapId === prevSelected.roadmapId),
      );
      return rest.length > 0 ? rest[0] : null;
    });
  };

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography sx={{ color: "red" }}>{error}</Typography>
        <Button sx={{ mt: 2 }} variant="contained" onClick={() => navigate("/chat")}>
          Powrót
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, display: "flex", gap: 2, height: "100vh" }}>
      {/* lewa lista */}
      <Paper
        elevation={0}
        sx={{
          width: 360,
          p: 2,
          borderRadius: 3,
          border: "1px solid #E5E7EB",
          overflowY: "auto",
        }}
      >
        <Typography fontWeight={900} sx={{ mb: 1 }}>
          Roadmaps Library
        </Typography>
        <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 2 }}>
          Wszystkie roadmapy ze wszystkich czatów
        </Typography>

        <Divider sx={{ mb: 2 }} />

        {items.length === 0 ? (
          <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
            Brak roadmap.
          </Typography>
        ) : (
          items.map((it) => (
            <Button
              key={`${it.chatId}_${it.roadmapId}`}
              fullWidth
              variant={
                selected?.roadmapId === it.roadmapId && selected?.chatId === it.chatId
                  ? "contained"
                  : "outlined"
              }
              sx={{
                mb: 1,
                borderRadius: 3,
                textTransform: "none",
                justifyContent: "flex-start",
                fontWeight: 800,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 0.2,
                py: 1,
              }}
              onClick={() => openItem(it)}
            >
              <Typography sx={{ fontWeight: 900, fontSize: 14 }}>
                {it.roadmap?.career || "Roadmap"}
              </Typography>
              <Typography sx={{ fontSize: 12, opacity: 0.8 }}>
                Chat: {it.chatTitle}
              </Typography>
            </Button>
          ))
        )}

        <Divider sx={{ my: 2 }} />

        <Button
          fullWidth
          variant="outlined"
          sx={{ textTransform: "none", borderRadius: 3, fontWeight: 800 }}
          onClick={() => navigate("/chat")}
        >
          Powrót do chatu
        </Button>
      </Paper>

      {/* RIGHT - details */}
      <Paper
        elevation={0}
        sx={{
          flex: 1,
          p: 3,
          borderRadius: 3,
          border: "1px solid #E5E7EB",
          overflowY: "auto",
        }}
      >
        {!selected ? (
          <Typography>Nie masz jeszcze żadnych roadmap.</Typography>
        ) : (
          <>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography sx={{ color: "text.secondary", mb: 0.5 }}>
                  Roadmap
                </Typography>
                <Typography variant="h5" fontWeight={950}>
                  {selected.roadmap?.career}
                </Typography>
                <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                  Chat: {selected.chatTitle}
                </Typography>
              </Box>

              <IconButton title="Usuń roadmap" onClick={handleDelete}>
                <DeleteIcon />
              </IconButton>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography fontWeight={900} sx={{ mb: 1 }}>
              Plan rozwoju
            </Typography>

            {Array.isArray(selected.roadmap?.stages) && selected.roadmap.stages.length > 0 ? (
              selected.roadmap.stages.map((s, i) => (
                <Box key={i} sx={{ mb: 2 }}>
                  <Typography fontWeight={900}>{s.period}</Typography>
                  <Typography sx={{ color: "text.secondary" }}>
                    {s.description}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography sx={{ color: "text.secondary" }}>
                Brak etapów.
              </Typography>
            )}

            <Divider sx={{ my: 2 }} />

            <Button
              variant="contained"
              sx={{ textTransform: "none", borderRadius: 3, fontWeight: 900 }}
              onClick={() => navigate("/chat")}
            >
              Powrót
            </Button>

            {/* PDF  */}
          </>
        )}
      </Paper>
    </Box>
  );
}
