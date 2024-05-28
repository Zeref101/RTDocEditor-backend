import { model, models, Schema } from "mongoose";

const GoogleSessionSchema = new Schema({
  expires: { type: Date },
  session: { type: String },
});

const GoogleSession =
  models.GoogleSession || model("GoogleSession", GoogleSessionSchema);

export default GoogleSession;
