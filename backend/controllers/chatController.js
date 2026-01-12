import { generateAIResponse } from "../services/aiService.js";

// 🔹 обычный чат
export const handleChat = async (req, res) => {
  try {
    const { message, history } = req.body;

    const aiReply = await generateAIResponse(message, history, "chat");

    res.json({ reply: aiReply });
  } catch (error) {
    console.error("CHAT ERROR:", error);
    res.status(500).json({ error: "AI processing failed" });
  }
};


export const handleRoadmap = async (req, res) => {
  try {
    const { history } = req.body;

    const aiReply = await generateAIResponse(
      "Wygeneruj ścieżkę kariery",
      history,
      "roadmap"
    );

  
    let parsed;
    try {
      const jsonMatch = aiReply.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found");
      parsed = JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error("ROADMAP JSON ERROR:", aiReply);
      return res.status(500).json({ error: "Invalid roadmap format" });
    }

    res.json({ roadmap: parsed });
  } catch (error) {
    console.error("ROADMAP ERROR:", error);
    res.status(500).json({ error: "Roadmap generation failed" });
  }
};
