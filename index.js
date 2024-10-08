import express from "express";
// import dotenv from "dotenv";
import { google } from "googleapis";
import NodeCache from "node-cache";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Image from "./models/image.js";
// hello
const PORT = process.env.PORT || 5000; // Use PORT environment variable or default to 5000
dotenv.config(); // Load environment variables from .env file
const DATABASE_URL = process.env.DATABASE_URL;

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
// app.get("/fetch-images", async (req, res) => {
//   const folderId = req.query.folderId; // Get folderId from query parameter

//   if (!folderId) {
//     return res
//       .status(400)
//       .json({ message: "folderId query parameter is required" });
//   }

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

// app.listen(PORT, () => {
//   console.log(`listening on port ${PORT}`);
// });
// mongoose.connect(DATABASE_URL).then(() => {
//   app.listen(PORT, () => {
//     console.log("listening on port", PORT);
//   });
// });
// app.get("/fetch-images", async (req, res) => {
//   const folderId = req.query.folderId; // Get folderId from query parameter
//   const pageSize = parseInt(req.query.pageSize) || 5; // Number of items per page (default to 10)
//   const pageToken = req.query.pageToken || null; // Token for the next page

//   if (!folderId) {
//     return res
//       .status(400)
//       .json({ message: "folderId query parameter is required" });
//   }

//   try {
//     const drive = google.drive({ version: "v3", auth });

//     // Fetch total file count
//     const totalCountResponse = await drive.files.list({
//       q: `'${folderId}' in parents and (mimeType contains 'image/')`,
//       fields: "files(id)",
//       pageSize: 1000, // Max page size to get all file IDs
//     });

//     const totalFileCount = totalCountResponse.data.files.length;

//     // Fetch paginated files
//     const response = await drive.files.list({
//       q: `'${folderId}' in parents and (mimeType contains 'image/')`,
//       fields: "nextPageToken, files(id, name)",
//       pageSize: pageSize,
//       pageToken: pageToken,
//     });

//     const files = response.data.files;
//     const nextPageToken = response.data.nextPageToken;

//     if (files.length) {
//       console.log("Images:");
//       files.forEach((file) => {
//         console.log(`${file.name} (${file.id})`);
//       });
//       return res.json({
//         totalFileCount: totalFileCount,
//         files: files.map((file) => ({
//           id: file.id,
//           name: file.name,
//         })),
//         nextPageToken: nextPageToken || null,
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
// app.get("/fetch-images", async (req, res) => {
//   const folderId = req.query.folderId; // Get folderId from query parameter

//   if (!folderId) {
//     return res
//       .status(400)
//       .json({ message: "folderId query parameter is required" });
//   }

//   try {
//     const drive = google.drive({ version: "v3", auth });

//     const response = await drive.files.list({
//       q: `'${folderId}' in parents and (mimeType contains 'image/')`,
//       fields: "nextPageToken, files(id, name)",
//     });

//     const files = response.data.files;
//     if (files.length) {
//       console.log("Images:");
//       files.forEach(async (file) => {
//         console.log(`${file.name} (${file.id})`);

//         // Check if the image already exists in MongoDB
//         const existingImage = await Image.findOne({ id: file.id });

//         if (existingImage) {
//           console.log(
//             `Image ${file.name} (${file.id}) already exists in MongoDB`
//           );
//         } else {
//           // Save each image to MongoDB
//           const newImage = new Image({
//             id: file.id,
//             name: file.name,
//             folderId: folderId,
//           });

//           try {
//             await newImage.save();
//             console.log(`Saved ${file.name} (${file.id}) to MongoDB`);
//           } catch (saveErr) {
//             console.error(
//               `Error saving ${file.name} (${file.id}) to MongoDB:`,
//               saveErr.message
//             );
//           }
//         }
//       });

//       return res.json({
//         files: files.map((file) => ({
//           id: file.id,
//           name: file.name,
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
// app.get("/fetch-image-ids", async (req, res) => {
//   const folderId = req.query.folderId; // Get folderId from query parameter

//   if (!folderId) {
//     return res
//       .status(400)
//       .json({ message: "folderId query parameter is required" });
//   }

//   try {
//     // Find images with the specified folderId in MongoDB
//     const images = await Image.find({ folderId: folderId }).select("id name");

//     if (images.length) {
//       return res.json({
//         images: images.map((image) => ({
//           id: image.id,
//           name: image.name,
//         })),
//       });
//     } else {
//       console.log("No images found.");
//       return res.status(404).json({ message: "No images found" });
//     }
//   } catch (err) {
//     console.error("Error fetching images from MongoDB:", err.message);
//     return res.status(500).json({ error: err.message });
//   }
// });
app.get("/sync-and-fetch-images", async (req, res) => {
  const folderId = req.query.folderId; // Get folderId from query parameter

  if (!folderId) {
    return res
      .status(400)
      .json({ message: "folderId query parameter is required" });
  }

  try {
    const drive = google.drive({ version: "v3", auth });

    const response = await drive.files.list({
      q: `'${folderId}' in parents and (mimeType contains 'image/')`,
      fields: "nextPageToken, files(id, name)",
    });

    const files = response.data.files;
    const updatedImages = [];

    if (files.length) {
      console.log("Images:");
      for (const file of files) {
        console.log(`${file.name} (${file.id})`);

        // Check if the image already exists in MongoDB
        const existingImage = await Image.findOne({ id: file.id });

        if (existingImage) {
          console.log(
            `Image ${file.name} (${file.id}) already exists in MongoDB`
          );
        } else {
          // Save each new image to MongoDB
          const newImage = new Image({
            id: file.id,
            name: file.name,
            folderId: folderId,
          });

          try {
            await newImage.save();
            console.log(`Saved ${file.name} (${file.id}) to MongoDB`);
            updatedImages.push(newImage);
          } catch (saveErr) {
            console.error(
              `Error saving ${file.name} (${file.id}) to MongoDB:`,
              saveErr.message
            );
          }
        }
      }

      // Fetch all images from the database for the given folder ID
      const allImages = await Image.find({ folderId });

      return res.json({
        files: allImages.map((file) => ({
          id: file.id,
          name: file.name,
        })),
        newImages: updatedImages.map((file) => ({
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
app.get("/getImages", async (req, res) => {
  const folderId = req.query.folderId;
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page

  if (!folderId) {
    return res
      .status(400)
      .json({ message: "folderId query parameter is required" });
  }

  // Call sync-and-fetch-images route
  const syncAndFetchImagesResponse = await fetch(
    `https://mydriver.onrender.com/sync-and-fetch-images?folderId=${folderId}`
  );
  const syncAndFetchImagesData = await syncAndFetchImagesResponse.json();

  if (syncAndFetchImagesResponse.status !== 200) {
    return res
      .status(syncAndFetchImagesResponse.status)
      .json(syncAndFetchImagesData);
  }

  // Fetch paginated images from the database for the given folder ID
  const skip = (page - 1) * limit;
  const totalImages = await Image.countDocuments({ folderId });
  const allImages = await Image.find({ folderId }).skip(skip).limit(limit);

  return res.json({
    files: allImages.map((file) => ({
      id: file.id,
      name: file.name,
    })),
    totalImages,
    totalPages: Math.ceil(totalImages / limit),
    currentPage: page,
  });
});
app.get("/", (req, res) => {
  res.send("welcome to mydriver api, World!");
});
mongoose.connect(DATABASE_URL).then(() => {
  app.listen(PORT, () => {
    console.log("listening on port", PORT);
  });
});
