import { useState } from "react";
import { useNavigate } from "react-router-dom";
import chatlogo from "./assets/chatlogo.png";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const [loadingRoadmap, setLoadingRoadmap] = useState(false);
  const [roadmapError, setRoadmapError] = useState(null);

  const navigate = useNavigate();

  const sendMessage = async () => {
    if (!input.trim()) return;

    const updatedHistory = [...messages, { role: "user", content: input }];
    setMessages(updatedHistory);

    try {
      const res = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          history: updatedHistory,
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Wystąpił błąd serwera." },
      ]);
    }

    setInput("");
  };

  const generateRoadmap = async () => {
    try {
      setLoadingRoadmap(true);
      setRoadmapError(null);

      const res = await fetch("http://localhost:3001/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: messages }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Roadmap error");
      }

      navigate("/roadmap", { state: data.roadmap });
    } catch (e) {
      setRoadmapError("Nie udało się wygenerować ścieżki kariery.");
    } finally {
      setLoadingRoadmap(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "flex-start" }}>
        <img
          src={chatlogo}
          alt="chatlogo"
          style={{ maxHeight: 120, maxWidth: 200 }}
        />
      </div>

      <h2 style={{ color: "black" }}>AI Career Helper</h2>

      {/* Chat window */}
      <div
        style={{
          height: 500,
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: 10,
          marginBottom: 10,
        }}
      >
        {messages.map((m, i) => (
          <p key={i} style={{ color: "black" }}>
            <b>{m.role === "user" ? "Ty" : "AI"}:</b> {m.content}
          </p>
        ))}
      </div>

      {/* Input */}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Zapytaj mnie o karierę..."
        style={{ width: "75%", padding: 10 }}
      />

      <button onClick={sendMessage} style={{ padding: 10, marginLeft: 8 }}>
        Wyślij
      </button>

      {/* Roadmap */}
      <div style={{ marginTop: 16 }}>
        <button
          disabled={loadingRoadmap || messages.length < 2}
          onClick={generateRoadmap}
        >
          {loadingRoadmap ? "Generowanie..." : "Generuj ścieżkę kariery"}
        </button>

        {roadmapError && (
          <p style={{ color: "red", marginTop: 8 }}>{roadmapError}</p>
        )}
      </div>

      {/* Navigation */}
      <div style={{ marginTop: 20 }}>
        <button onClick={() => navigate("/")}>Welcome Page</button>
      </div>
    </div>
  );
}
