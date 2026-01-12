import { Box, Typography, Button, Divider } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

export default function Roadmap() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Brak danych roadmapy.</Typography>
        <Button onClick={() => navigate("/Chat")}>Powrót</Button>
      </Box>
    );
  }

  const { career, stages } = state;

  return (
    <Box sx={{ p: 4, maxWidth: 800, m: "0 auto" }}>
      <Typography variant="h4" fontWeight={700}>
        Twoja ścieżka kariery
      </Typography>

      <Typography color="text.secondary" sx={{ mt: 1 }}>
        Wygenerowana na podstawie rozmowy z systemem doradczym.
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" fontWeight={600}>
        Proponowany kierunek
      </Typography>
      <Typography>{career}</Typography>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" fontWeight={600}>
        Plan rozwoju
      </Typography>

      {stages?.map((s, i) => (
        <Box key={i} sx={{ mt: 2 }}>
          <Typography fontWeight={600}>{s.period}</Typography>
          <Typography>{s.description}</Typography>
        </Box>
      ))}

      <Button sx={{ mt: 4 }} variant="contained" onClick={() => navigate("/Chat")}>
        Powrót do chatu
      </Button>
    </Box>
  );
}
