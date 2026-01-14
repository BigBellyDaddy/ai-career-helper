import { Box, Typography, Button, Divider } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

export default function Roadmap() {
  const location = useLocation();
  const navigate = useNavigate();

  const saved = localStorage.getItem("roadmap");
  const savedRoadmap = saved ? JSON.parse(saved) : null;

  const roadmapRaw = location.state ?? savedRoadmap;
  const roadmap = roadmapRaw?.roadmap ?? roadmapRaw;

  if (!roadmap) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Brak danych roadmapy.</Typography>
        <Button variant="contained" onClick={() => navigate("/Chat")}>
          Powrót
        </Button>
      </Box>
    );
  }

  const { career, stages } = roadmap;

  return (
    <Box sx={{ p: 4, maxWidth: 800, m: "0 auto" }}>
      <Typography color="text.secondary" sx={{ mt: 1 }}>
        Twoja ścieżka kariery
      </Typography>

      

      <Typography color="text.secondary" sx={{ mt: 1 }}>
        Wygenerowana na podstawie rozmowy z systemem doradczym.
      </Typography>
      

      <Divider color="text.secondary" sx={{ mt: 1 }} />

      <Typography color="text.secondary" sx={{ mt: 1 }}>
        Proponowany kierunek
      </Typography>

      <Typography color="text.secondary" sx={{ mt: 1 }}>{roadmap.career}</Typography>

      <Divider color="text.secondary" sx={{ mt: 1 }} />

    

      <Divider color="text.secondary" sx={{ mt: 1 }} />

      <Typography color="text.secondary" sx={{ mt: 1 }}>
        Plan rozwoju
      </Typography>

      {Array.isArray(stages) && stages.length > 0 ? (
        stages.map((s, i) => (
          <Box color="text.secondary" sx={{ mt: 1 }}>
            <Typography fontWeight={600}>{s.period}</Typography>
            <Typography>{s.description}</Typography>
          </Box>
        ))
      ) : (
        <Typography color="text.secondary">Brak etapów w roadmapie.</Typography>
      )}

      <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
        <Button variant="contained" onClick={() => navigate("/Chat")}>
          Powrót do chatu
        </Button>

        <Button
          variant="outlined"
          onClick={() => {
            localStorage.removeItem("roadmap");
            navigate("/Chat");
          }}
        >
          Wyczyść roadmap
        </Button>
      </Box>
    </Box>
  );
}
