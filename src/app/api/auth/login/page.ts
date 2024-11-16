// pages/api/auth/login.js
import { auth } from "../../../lib/firebase/firebase.config";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { idToken } = req.body;

  console.log(idToken, "<==id");

  if (!idToken) {
    return res.status(400).json({ message: "No ID token provided" });
  }

  try {
    // Verify the ID token with Firebase Admin SDK
    const decodedToken = await auth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // Get user data or create a user if necessary
    const userRecord = await auth.getUser(userId);

    // Return user data
    return res.status(200).json({ user: userRecord });
  } catch (error) {
    console.error("Error verifying ID token:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
}
