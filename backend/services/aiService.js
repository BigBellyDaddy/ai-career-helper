import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateAIResponse = async (
  message,
  history = [],
  mode = "chat"
) => {
  const systemPrompt =
    mode === "roadmap"
      ? `
Jesteś systemem doradczym.
Na podstawie całej rozmowy wygeneruj ŚCIEŻKĘ KARIERY.

ZWRÓĆ WYŁĄCZNIE POPRAWNY JSON.
NIE DODAWAJ ŻADNEGO TEKSTU POZA JSON.

FORMAT:
{
  "career": "nazwa ścieżki kariery",
  "stages": [
    {
      "period": "0–3 miesiące",
      "description": "..."
    },
    {
      "period": "3–6 miesięcy",
      "description": "..."
    },
    {
      "period": "6–12 miesięcy",
      "description": "..."
    }
  ]
}
`
      : `
Jesteś wyspecjalizowanym doradcą kariery.
Twoim celem nie jest prowadzenie luźnej rozmowy,
lecz zebranie informacji o użytkowniku.

Zadaj pytania dotyczące:
- zainteresowań,
- umiejętności,
- preferowanego stylu pracy.

Nie generuj jeszcze ścieżki kariery,
dopóki użytkownik nie zakończy rozmowy.
`;

  const messages = [
    { role: "system", content: systemPrompt },
    ...history,
    { role: "user", content: message },
  ];

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
  });

  return response.choices[0].message.content;
};
