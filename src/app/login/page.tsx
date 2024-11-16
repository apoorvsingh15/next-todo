"use client";
// pages/login.js
import { useState } from "react";
import { auth } from "../lib/firebase/firebase.config"; // Your Firebase config
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function Login() {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Get the Firebase ID token
      const idToken = await user.getIdToken();

      // Send the token to the server for verification
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();
      console.log("Server Response:", data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error signing in with Google:", error.message);
      } else {
        console.error("Unknown error signing in with Google:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Sign in with Google</h1>
      <button onClick={handleGoogleSignIn} disabled={loading}>
        {loading ? "Signing in..." : "Sign in with Google"}
      </button>
    </div>
  );
}
