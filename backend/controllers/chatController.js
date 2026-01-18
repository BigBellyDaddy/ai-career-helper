import { generateAIResponse } from "../services/aiService.js";

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

    
    const roadmap = await generateAIResponse(
      "Wygeneruj roadmapę",
      history,
      "roadmap"
    );

    res.json({ roadmap });
  } catch (error) {
    console.error("ROADMAP ERROR:", error);
    res.status(500).json({ error: "Roadmap generation failed" });
  }
};

