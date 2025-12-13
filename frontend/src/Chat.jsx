import { useState } from "react";
import { useNavigate } from "react-router-dom";
import chatlogo from "./assets/chatlogo.png";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const sendMessage = async () => {
    if (!input.trim()) return;

    const updatedHistory = [...messages, { role: "user", content: input }];

    setMessages(updatedHistory);

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

    setInput("");
  };

  return (
    <div style={{ flex: 1 , margin: "0 auto", padding: 20 }}>
      <div
  style={{
    display: "flex",
    justifyContent: "flex-start",
  }}
>

        <img
        src={chatlogo}
        alt="chatlogo"
        style={{ maxHeight: 500, maxWidth: 300,  }}
      />
      </div>
      

      <h2 style={{color:"black"}}>AI Career Helper</h2>

      <div
        style={{
          height: 600,
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: 10,
          marginBottom: 10,
        }}
      >
        {messages.map((m, i) => (
          <p key={i} style={{color: "black"}}>
            <b>{m.role === "user" ? "Ty" : "AI"}:</b> {m.content}
          </p>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Zapytaj mnie o karierę..."
        style={{ width: "80%", padding: 10 }}
      />
      <button onClick={sendMessage} style={{ padding: 10 }}>
        Wyślij
      </button><button onClick={() => navigate("/")}>Welcome Page</button>
    </div>
  );
}
