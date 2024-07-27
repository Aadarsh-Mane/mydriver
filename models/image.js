import mongoose from "mongoose";
const imageSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    folderId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
export default mongoose.model("Image", imageSchema);
