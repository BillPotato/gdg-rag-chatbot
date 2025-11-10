
"use client";

import { SignIn } from "@clerk/nextjs";
import { Container, Paper, Typography, Box } from "@mui/material";

export default function SignInPage() {
  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #4f46e5, #7c3aed)", // gradient background
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 3,
            textAlign: "center",
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            color="primary"
            gutterBottom
          >
            📘 Welcome Back
          </Typography>

          <Typography variant="body1" color="text.secondary" mb={3}>
            Sign in to continue your study session
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <SignIn signUpUrl="/sign-up" />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: 3,
          width: "100%",
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
        }}
      >
        {/* Header */}
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ mb: 2, fontFamily: "var(--font-geist-sans)" }}
        >
          📘 Course Study Chatbot
        </Typography>
        <Typography
          align="center"
          color="text.secondary"
          sx={{ mb: 4, fontFamily: "var(--font-geist-mono)" }}
        >
          Sign in to access your study assistant!
        </Typography>

        {/* SignIn Form */}
        <SignIn
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
          appearance={{
            elements: {
              formButtonPrimary: {
                backgroundColor: "#1976d2",
                borderRadius: "12px",
                fontFamily: "var(--font-geist-sans)",
              },
              formFieldInput: {
                borderRadius: "8px",
                padding: "10px",
                fontFamily: "var(--font-geist-mono)",
              },
            },
          }}
        />
      </Paper>

