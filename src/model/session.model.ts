import mongoose, { Schema, model, models } from "mongoose";

const sessionSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  expiresAt: {
    type: Date,
    required: true,
    default: () => {
      const date = new Date();
      date.setDate(date.getDate() + 1);
      return date;
    },
  },
});

const Session = models.Session || model("Session", sessionSchema);
export default Session;
