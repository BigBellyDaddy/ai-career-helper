import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateAIResponse = async (message, history = []) => {
  const messages = [
    {
      role: "system",
      content:
        "Jesteś AI-doradcą kariery. Prowadź dialog, zadawaj pytania, analizuj odpowiedzi i pomagaj w wyborze ścieżki zawodowej.",
    },
    ...history,
    {
      role: "user",
      content: message,
    },
  ];

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
  });

  return response.choices[0].message.content;
};
