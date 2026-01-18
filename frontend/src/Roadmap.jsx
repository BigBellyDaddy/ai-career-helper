import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
  Paper,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useLocation, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import {
  loadChats,
  loadRoadmaps,
  loadRoadmap,
  deleteRoadmap,
} from "./db/chatDb";
import { PDFDownloadLink } from "@react-pdf/renderer";
import RoadmapPdf from "./RoadmapPdf";

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

    setItems((prev) => {
      const rest = prev.filter(
        (x) =>
          !(x.chatId === selected.chatId && x.roadmapId === selected.roadmapId),
      );

      setSelected(rest.length > 0 ? rest[0] : null);
      return rest;
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
        <Button
          sx={{ mt: 2 }}
          variant="contained"
          onClick={() => navigate("/chat")}
        >
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
                selected?.roadmapId === it.roadmapId &&
                selected?.chatId === it.chatId
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

              <PDFDownloadLink
                document={
                  <RoadmapPdf
                    roadmap={selected?.roadmap}
                    chatTitle={selected?.chatTitle}
                  />
                }
                fileName={`${(selected?.roadmap?.career || "roadmap")
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "") // убираем диакритику
                  .replace(/[^\p{L}\p{N}_-]+/gu, "_")}.pdf`}
                style={{ textDecoration: "none" }}
              >
                {({ loading }) => (
                  <Button
                    variant="outlined"
                    sx={{
                      textTransform: "none",
                      borderRadius: 3,
                      fontWeight: 900,
                    }}
                    disabled={!selected || loading}
                  >
                    {loading ? "Preparing PDF..." : "Export PDF"}
                  </Button>
                )}
              </PDFDownloadLink>

              <IconButton title="Usuń roadmap" onClick={handleDelete}>
                <DeleteIcon />
              </IconButton>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography fontWeight={900} sx={{ mb: 1 }}>
              Podsumowanie dopasowania
            </Typography>

            <Typography sx={{ color: "text.secondary", mb: 2 }}>
              {selected.roadmap?.fit_summary || "Brak podsumowania."}
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* STRENGTHS */}
            <Typography fontWeight={900} sx={{ mb: 1 }}>
              Top Strengths
            </Typography>
            {Array.isArray(selected.roadmap?.top_strengths) &&
            selected.roadmap.top_strengths.length > 0 ? (
              selected.roadmap.top_strengths.map((x, i) => (
                <Typography key={i} sx={{ color: "text.secondary" }}>
                  • {x}
                </Typography>
              ))
            ) : (
              <Typography sx={{ color: "text.secondary" }}>Brak.</Typography>
            )}

            <Divider sx={{ my: 2 }} />

            {/* SKILL GAPS */}
            <Typography fontWeight={900} sx={{ mb: 1 }}>
              Skill gaps
            </Typography>
            {Array.isArray(selected.roadmap?.skill_gaps) &&
            selected.roadmap.skill_gaps.length > 0 ? (
              selected.roadmap.skill_gaps.map((x, i) => (
                <Typography key={i} sx={{ color: "text.secondary" }}>
                  • {x}
                </Typography>
              ))
            ) : (
              <Typography sx={{ color: "text.secondary" }}>Brak.</Typography>
            )}

            <Divider sx={{ my: 2 }} />

            {/* WHY NOT OTHER */}
            <Typography fontWeight={900} sx={{ mb: 1 }}>
              Dlaczego nie inne ścieżki
            </Typography>
            {Array.isArray(selected.roadmap?.why_not_other) &&
            selected.roadmap.why_not_other.length > 0 ? (
              selected.roadmap.why_not_other.map((x, i) => (
                <Typography key={i} sx={{ color: "text.secondary" }}>
                  • {x}
                </Typography>
              ))
            ) : (
              <Typography sx={{ color: "text.secondary" }}>Brak.</Typography>
            )}

            <Divider sx={{ my: 2 }} />

            {/* 12 WEEK ROADMAP */}
            <Typography fontWeight={900} sx={{ mb: 1 }}>
              Plan 12 tygodni
            </Typography>

            {Array.isArray(selected.roadmap?.roadmap_12_weeks) &&
            selected.roadmap.roadmap_12_weeks.length > 0 ? (
              selected.roadmap.roadmap_12_weeks.map((w) => (
                <Paper
                  key={w.week}
                  elevation={0}
                  sx={{
                    p: 2,
                    mb: 1.5,
                    borderRadius: 3,
                    border: "1px solid #E5E7EB",
                    bgcolor: "#FAFAFA",
                  }}
                >
                  <Typography fontWeight={950}>
                    Week {w.week}: {w.theme}
                  </Typography>

                  <Typography fontWeight={900} sx={{ mt: 1 }}>
                    Goals
                  </Typography>
                  {(w.goals || []).map((x, i) => (
                    <Typography key={i} sx={{ color: "text.secondary" }}>
                      • {x}
                    </Typography>
                  ))}

                  <Typography fontWeight={900} sx={{ mt: 1 }}>
                    Tasks
                  </Typography>
                  {(w.tasks || []).map((x, i) => (
                    <Typography key={i} sx={{ color: "text.secondary" }}>
                      • {x}
                    </Typography>
                  ))}

                  <Typography fontWeight={900} sx={{ mt: 1 }}>
                    Deliverables
                  </Typography>
                  {(w.deliverables || []).map((x, i) => (
                    <Typography key={i} sx={{ color: "text.secondary" }}>
                      • {x}
                    </Typography>
                  ))}

                  <Typography fontWeight={900} sx={{ mt: 1 }}>
                    Checks
                  </Typography>
                  {(w.checks || []).map((x, i) => (
                    <Typography key={i} sx={{ color: "text.secondary" }}>
                      • {x}
                    </Typography>
                  ))}

                  <Typography fontWeight={900} sx={{ mt: 1 }}>
                    Done definition
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}>
                    {w.done_definition || "-"}
                  </Typography>
                </Paper>
              ))
            ) : Array.isArray(selected.roadmap?.stages) ? (
              // ✅ fallback под старый формат чтобы ничего не ломалось
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
                Brak planu.
              </Typography>
            )}

            <Divider sx={{ my: 2 }} />

            {/* PROJECTS */}
            <Typography fontWeight={900} sx={{ mb: 1 }}>
              Projects
            </Typography>

            {Array.isArray(selected.roadmap?.projects) &&
            selected.roadmap.projects.length > 0 ? (
              selected.roadmap.projects.map((p, i) => (
                <Paper
                  key={i}
                  elevation={0}
                  sx={{
                    p: 2,
                    mb: 1.5,
                    borderRadius: 3,
                    border: "1px solid #E5E7EB",
                  }}
                >
                  <Typography fontWeight={950}>{p.name}</Typography>
                  <Typography sx={{ color: "text.secondary", mb: 1 }}>
                    {p.goal}
                  </Typography>

                  <Typography fontWeight={900}>Requirements</Typography>
                  {(p.requirements || []).map((x, idx) => (
                    <Typography key={idx} sx={{ color: "text.secondary" }}>
                      • {x}
                    </Typography>
                  ))}

                  <Typography fontWeight={900} sx={{ mt: 1 }}>
                    Stack
                  </Typography>
                  {(p.stack || []).map((x, idx) => (
                    <Typography key={idx} sx={{ color: "text.secondary" }}>
                      • {x}
                    </Typography>
                  ))}

                  <Typography fontWeight={900} sx={{ mt: 1 }}>
                    Deliverables
                  </Typography>
                  {(p.deliverables || []).map((x, idx) => (
                    <Typography key={idx} sx={{ color: "text.secondary" }}>
                      • {x}
                    </Typography>
                  ))}
                </Paper>
              ))
            ) : (
              <Typography sx={{ color: "text.secondary" }}>
                Brak projektów.
              </Typography>
            )}

            <Divider sx={{ my: 2 }} />

            {/* MILESTONES */}
            <Typography fontWeight={900} sx={{ mb: 1 }}>
              Milestones
            </Typography>
            {(selected.roadmap?.milestones || []).length > 0 ? (
              selected.roadmap.milestones.map((x, i) => (
                <Typography key={i} sx={{ color: "text.secondary" }}>
                  • {x}
                </Typography>
              ))
            ) : (
              <Typography sx={{ color: "text.secondary" }}>Brak.</Typography>
            )}

            <Divider sx={{ my: 2 }} />

            {/* RISKS */}
            <Typography fontWeight={900} sx={{ mb: 1 }}>
              Risks
            </Typography>
            {(selected.roadmap?.risks || []).length > 0 ? (
              selected.roadmap.risks.map((x, i) => (
                <Typography key={i} sx={{ color: "text.secondary" }}>
                  • {x}
                </Typography>
              ))
            ) : (
              <Typography sx={{ color: "text.secondary" }}>Brak.</Typography>
            )}

            <Divider sx={{ my: 2 }} />

            {/* NEXT QUESTIONS */}
            <Typography fontWeight={900} sx={{ mb: 1 }}>
              Następne pytania
            </Typography>
            {(selected.roadmap?.next_questions || []).length > 0 ? (
              selected.roadmap.next_questions.map((x, i) => (
                <Typography key={i} sx={{ color: "text.secondary" }}>
                  • {x}
                </Typography>
              ))
            ) : (
              <Typography sx={{ color: "text.secondary" }}>Brak.</Typography>
            )}

            <Divider sx={{ my: 2 }} />

            <Button
              variant="contained"
              sx={{ textTransform: "none", borderRadius: 3, fontWeight: 900 }}
              onClick={() => navigate("/chat")}
            >
              Powrót
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
}
