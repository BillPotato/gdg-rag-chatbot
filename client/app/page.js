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
import {
    SignedIn,
    SignedOut,
    UserButton
} from "@clerk/nextjs"
import {
    useRouter
} from "next/navigation"

// 2. Component states
export default function HomePage() {
  const [messages, setMessages] = useState([]);  // chat history
  const [input, setInput] = useState("");        // user input
  const router = useRouter();

  // 3. send message function
    const sendMessage = async () => {
    if (!input) return;

    // Add user message to chat
    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);

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
    setInput("");
  };

  // 4. UI layout (frontend)
  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
        <SignedOut>
          <Box
            sx={{
              textAlign: "center",
              mt: 20,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
    }}
  >
  
    <Typography variant="body1" color="text.secondary">
      Please sign in to start chatting with your study assistant.
    </Typography>
    <Button
      variant="contained"
      size="large"
      onClick={() => router.push("/sign-in")}
    >
      Sign In
    </Button>
  </Box>
</SignedOut>
 
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
      <SignedIn>
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
      </SignedIn>
    </Container> 
  );
}
