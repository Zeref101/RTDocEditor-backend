const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CollaboratedDocSchema = new Schema({
  documentId: {
    type: Schema.Types.ObjectId,
    ref: "Document",
    required: true,
  },
  userId: {
    type: [Schema.Types.ObjectId],
    ref: "User",
    required: true,
  },
});

const CollaboratedDoc =
  mongoose.models.CollaboratedDoc ||
  mongoose.model("CollaboratedDoc", CollaboratedDocSchema);

export default CollaboratedDoc;
