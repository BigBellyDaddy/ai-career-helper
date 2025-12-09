import { useState } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Добавляем сообщение пользователя в историю
    const updatedHistory = [
      ...messages,
      { role: "user", content: input }
    ];

    setMessages(updatedHistory);

    // Отправляем на backend
    const res = await fetch("http://localhost:3001/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: input,
        history: updatedHistory
      }),
    });

    const data = await res.json();

    // Добавляем ответ AI
    setMessages(prev => [
      ...prev,
      { role: "assistant", content: data.reply }
    ]);

    setInput("");
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <h2>AI Career Helper</h2>

      <div style={{
        height: 400,
        overflowY: "auto",
        border: "1px solid #ccc",
        padding: 10,
        marginBottom: 10
      }}>
        {messages.map((m, i) => (
          <p key={i}>
            <b>{m.role === "user" ? "Ты" : "AI"}:</b> {m.content}
          </p>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Напиши что-то..."
        style={{ width: "80%", padding: 10 }}
      />
      <button onClick={sendMessage} style={{ padding: 10 }}>
        Отправить
      </button>
    </div>
  );
}
