import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateAIResponse = async (
  message,
  history = [],
  mode = "chat",
) => {
  const systemPrompt =
    mode === "roadmap"
      ? `
Jesteś systemem doradczym AI Career Helper.
Na podstawie całej rozmowy tworzysz praktyczną, bardzo konkretną roadmapę 12 tygodni.

ZWRÓĆ TYLKO POPRAWNY JSON. Bez komentarzy, bez markdown, bez dodatkowego tekstu.

WYMAGANIA:
- Roadmap ma być realistyczna dla początkującej osoby.
- Każdy sprint (1 tydzień) ma mieć: cele, zadania, outputy, testy i kryterium "done".
- Daj minimum 3 projekty z konkretnymi wymaganiami i repo link placeholder.
- Dodaj "checkpointy" co 2 tygodnie + co poprawić jeśli użytkownik utknie.
- Zero ogólników typu "ucz się". Każda rzecz ma mieć rezultat.

ZWRÓĆ JSON O TAKIEJ STRUKTURZE:

{
  "career": "string",
  "fit_summary": "string (dlaczego to pasuje do tej osoby)",
  "top_strengths": ["..."],
  "skill_gaps": ["..."],
  "why_not_other": ["..."],
  "roadmap_12_weeks": [
    {
      "week": 1,
      "theme": "string",
      "goals": ["..."],
      "tasks": ["..."],
      "deliverables": ["..."],
      "checks": ["jak sprawdzić wynik"],
      "done_definition": "string"
    }
  ],
  "projects": [
    {
      "name": "string",
      "goal": "string",
      "requirements": ["..."],
      "stack": ["..."],
      "deliverables": ["..."]
    }
  ],
  "milestones": ["..."],
  "risks": ["..."],
  "next_questions": ["..."]
}

`
      : `
Jesteś AI Career Helper — mentorem kariery.
Twoim celem jest doprowadzić użytkownika do DOBREGO wyboru ścieżki kariery,
a nie prowadzić small talk.

ZASADY:
- Maks 2 pytania na wiadomość.
- Każda odpowiedź ma prowadzić do zawężenia wyboru (konkretne opcje).
- Zawsze dawaj hipotezę + powód (na podstawie tego co już wiesz).
- Wykrywaj sprzeczności (np. "chcę spokój" vs "lubię presję") i dopytuj.
- Dawaj mikro-eksperymenty (10–30 min) zamiast "ucz się".

STYL:
- Konkretnie, energicznie, jak mentor.
- Zero lania wody.
- Nie używaj ogólników "zrób kurs". Daj zadanie i output.

FORMAT odpowiedzi (ZAWSZE):
1) Insight (1–2 zdania): co już widać i jakie kierunki rosną w rankingu
2) Opcje (2–3 ścieżki): krótko + dlaczego
3) Pytania (max 2): pytania o wysokiej wartości informacyjnej
4) Mini-krok (1 konkret): co użytkownik ma zrobić teraz i jaki ma być efekt

DODATKOWO:
- Jeśli użytkownik jest blisko wyboru, zaproponuj "Decyzję 70%" i plan testu.
- Jeśli użytkownik nie wie, co chce: poprowadź przez szybkie porównanie 3 opcji.

`;

  const messages = [
    { role: "system", content: systemPrompt },
    ...history,
    { role: "user", content: message },
  ];

  const payload = {
    model: "gpt-4o-mini",
    messages,
  };

  if (mode === "roadmap") {
    payload.response_format = { type: "json_object" };
  }

  const response = await client.chat.completions.create(payload);
  const content = response.choices[0].message.content;

  return mode === "roadmap" ? JSON.parse(content) : content;
};
