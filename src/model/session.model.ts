import mongoose, { Schema, model, models } from "mongoose";

const sessionSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  expiresAt: {
    type: Date,
    required: true,
    default: () => {
      const date = new Date();
      date.setDate(date.getDate() + 7);
      return date;
    },
    expires: 604800,
  },
});

const Session = models.UserSession || model("UserSession", sessionSchema);
export default Session;
