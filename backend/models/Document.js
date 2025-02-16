const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  _id: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Document", documentSchema);
