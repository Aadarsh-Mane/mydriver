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
imageSchema.index({ folderId: 1, id: 1, name: 1 });
export default mongoose.model("Image", imageSchema);
