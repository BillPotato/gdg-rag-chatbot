"use client";
import { SignUp } from "@clerk/nextjs";
import { Container, Paper, Typography } from "@mui/material";

export default function SignUpPage() {
  return (
    <Container
    maxWidth="sm"
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh", // center vertically
    }}
    >
    <Paper
     elevation={6}
     sx={{
      p: 4,
      borderRadius: 3,
      width: "100%",
      boxShadow: "0 8px 24px rgba(0,0,0,0,2)",
     }}
     >
    
    <Typography
     variant="h4"
     align="center"
     color="text.secondary"
     sx={{mb: 4, fontFamily: "var(--font-geist-mono"}}
     > 
      Create your account to start chatting with your study assistant!
     </Typography> 

    <SignUp
     path="/sign-up"
     routing="path"
     signInUrl="/sign-in"
     appearance={{
      elements: {
        formButtonPrimary: {
          backgroundCOlor: "#1976d2", 
          borderRadius: "12px", 
          fontFamily: "var(--font-geist-sans",
        },
        formFieldInput: {
         borderRadius: "8px",
         padding: "10px",
         fontFamily: "var(--font-geist-mono",
         },
      },
    }}
    />
    </Paper>
  </Container>
  )
}
