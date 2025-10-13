// 1. imports and setup
"use client";

import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Paper,
  Typography,
  Box,
} from "@mui/material";

// import firebase db
import db from "./firebase.js"
import {
    getUsers,
    addMsg,
} from "./firebase.js"

const users = await getUsers(db)
console.log(users)

// 2. Component states
export default function HomePage() {
  const [messages, setMessages] = useState([]);  // chat history
  const [input, setInput] = useState("");        // user input

  // 3. send message function
    const sendMessage = async () => {
    if (!input) return;

    // Add user message to chat
    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    // add userMessage to database
    await addMsg(userMessage)

    // Send request to FastAPI backend
    const res = await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: input }),
    });
    const data = await res.json();

    // Add bot response
    const botMessage = { role: "assistant", content: data.answer };
    setMessages((prev) => [...prev, botMessage]);
    // add botMessage to database
    await addMsg(botMessage)
    setInput("");
  };

  // 4. UI layout (frontend)
  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        📘 Course Study Chatbot
      </Typography>

      {/* Chat history box */}
      <Paper elevation={3} sx={{ p: 2, height: 400, overflowY: "auto", mb: 2 }}>
        {messages.map((msg, idx) => (
          <Box key={idx} sx={{ mb: 1 }}>
            <Typography
              variant="subtitle2"
              color={msg.role === "user" ? "primary" : "secondary"}
            >
              {msg.role === "user" ? "You" : "Bot"}:
            </Typography>
            <Typography>{msg.content}</Typography>
          </Box>
        ))}
      </Paper>

      {/* Input + Send button */}
      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Ask about the syllabus..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <Button variant="contained" onClick={sendMessage}>
          Send
        </Button>
      </Box>
    </Container>
  );
}
