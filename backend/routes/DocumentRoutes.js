const express = require("express");
const router = express.Router();
const Document = require("../models/Document");
const { v4: uuidv4 } = require("uuid");

// Create new document
router.post("/", async (req, res) => {
  try {
    const docId = uuidv4();
    const doc = new Document({ _id: docId, content: "" });
    await doc.save();
    res.status(201).json({ _id: docId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const docs = await Document.find().sort({ createdAt: -1 });
    res.json(docs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get document by ID
router.get("/:id", async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });
    res.json(doc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update document content
router.patch("/:id", async (req, res) => {
  try {
    const doc = await Document.findByIdAndUpdate(
      req.params.id,
      { content: req.body.content },
      { new: true }
    );
    if (!doc) return res.status(404).json({ message: "Document not found" });
    res.json(doc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
