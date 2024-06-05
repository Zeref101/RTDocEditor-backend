import mongoose, { Schema, model, models } from "mongoose";

const DocumentSchema = new Schema({
  content: { type: String },
  title: { type: String },
  owner: { type: mongoose.Schema.ObjectId, required: true },
  lastModified: { type: Date },
});

const Document = models.Document || model("Document", DocumentSchema);

export default Document;
