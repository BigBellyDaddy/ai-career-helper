import { generateAIResponse } from "../services/aiService.js";

export const handleChat = async (req, res) => {
  try {
    const { message, history } = req.body;

    const aiReply = await generateAIResponse(message, history);

    res.json({ reply: aiReply });
  } catch (error) {
    console.error("AI ERROR:", error);
    res.status(500).json({ error: "AI processing failed" });
  }
};
