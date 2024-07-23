import express from "express";
import dotenv from "dotenv";
import { google } from "googleapis";
import NodeCache from "node-cache";

const PORT = process.env.PORT || 5000; // Use PORT environment variable or default to 5000
dotenv.config(); // Load environment variables from .env file

const app = express();
app.use(express.json());
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.client_email,
    private_key: process.env.private_key,
  },
  projectId: process.env.project_id,
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
});
// const drive = google.drive({ version: "v3", auth });

// Function to get all image files from a Google Drive folder
// const folderId = "1GK4GfA1ICMdO5ewtUBTgbTYnDRVHqgYu";
// const folderId = "1TKlHnawAQCXydSbTEU4bVeJLiHFujjCC";

// app.get("/fetch-images", async (req, res) => {
//   try {
//     const drive = google.drive({ version: "v3", auth });

//     const response = await drive.files.list({
//       q: `'${folderId}' in parents and (mimeType contains 'image/')`,
//       fields: "nextPageToken, files(id, name)",
//     });

//     const files = response.data.files;
//     if (files.length) {
//       console.log("Images:");
//       files.forEach((file) => {
//         console.log(`${file.name} (${file.id})`);
//       });
//       return res.json({
//         files: files.map((file) => ({
//           id: file.id,
//           name: file.name,
//           totals: file.length,
//         })),
//       });
//     } else {
//       console.log("No images found.");
//       return res.status(404).json({ message: "No images found" });
//     }
//   } catch (err) {
//     console.error("The API returned an error:", err.message);
//     return res.status(500).json({ error: err.message });
//   }
// });
app.get("/fetch-images", async (req, res) => {
  const folderId = req.query.folderId; // Get folderId from query parameter

  if (!folderId) {
    return res.status(400).json({ message: "folderId query parameter is required" });
  }

  try {
    const drive = google.drive({ version: "v3", auth });

    const response = await drive.files.list({
      q: `'${folderId}' in parents and (mimeType contains 'image/')`,
      fields: "nextPageToken, files(id, name)",
    });

    const files = response.data.files;
    if (files.length) {
      console.log("Images:");
      files.forEach((file) => {
        console.log(`${file.name} (${file.id})`);
      });
      return res.json({
        files: files.map((file) => ({
          id: file.id,
          name: file.name,
        })),
      });
    } else {
      console.log("No images found.");
      return res.status(404).json({ message: "No images found" });
    }
  } catch (err) {
    console.error("The API returned an error:", err.message);
    return res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
