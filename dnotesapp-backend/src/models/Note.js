const mongoose = require("mongoose");
const { Schema } = mongoose;
const noteSchema = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
  },
  { timestamps: true })

module.exports = mongoose.model('Note', noteSchema);
