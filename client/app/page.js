// 1. imports and setup
"use client";

import { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import {
    useAuth,
    isLoaded,
    SignedIn,
    SignedOut,
    UserButton
} from "@clerk/nextjs"
import {
    useRouter
} from "next/navigation"
import {
    createUser
} from "./utils/firebaseServices"

// Import Poppins Black font
import "@fontsource/poppins/900.css";

// Import Poppins Black font
import "@fontsource/poppins/900.css";

// 2. Component states
export default function HomePage() {
  const [messages, setMessages] = useState([]);  // chat history
  const [input, setInput] = useState("");        // user input
  const router = useRouter();

//   console.log("messages:", messages)

  // Create user if doesn't exist and get userObj if exists
  const { userId } = useAuth()
//   console.log("userId:",userId)

  // Create user and get chat history
  useEffect(() => {
  createUser(userId).then(userObj => {
    // console.log(userObj)
    setMessages(userObj.chats)
  })
  }, [userId])

  // 3. send message function
    const sendMessage = async () => {
    if (!input) return;

    // Add user message to chat
    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");

    // Send request to FastAPI backend
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: input, userId: userId }),
    });
    const data = await res.json();

    // Add bot response
    const botMessage = { role: "assistant", content: data.answer };
    setMessages((prev) => [...prev, botMessage]);
  };

  // 4. UI layout (frontend)
  return (
    <Box
        sx={{
            minHeight: "100vh",
            backgroundColor: "#a5d1f2",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            py: 4,
        }}
    >   
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


      <SignedIn>
      <UserButton/>
      <Typography variant="h4" gutterBottom align="center">
        📘 Course Study Chatbot
      </Typography>

      {/* Chat history box */}
        <Paper
            elevation={3}
            sx={{
                p: 2,
                height: 400,
                overflowY: "auto",
                mb: 2,
                border: "4px solid #1991d2",
                borderRadius: 2,
                backgroundColor: "white",         
                }}
        >
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
        <Button
            variant="contained" 
            onClick={sendMessage}
            sx={{
                backgroundColor: "#1991d2",
                color: "white",
                fontWeight: "bold",
                "&:hover": {
                    backgroundColor: "#157bb0",
                },
            }} 
        >
          Send
        </Button>
      </Box>
      </SignedIn>
    </Container> 
    </Box>
  );
}
