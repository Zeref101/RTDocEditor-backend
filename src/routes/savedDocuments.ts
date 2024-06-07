import express from "express";
import User from "../model/User.model";
import Document from "../model/Document.model";
import { connectToDB } from "../db";

const router = express.Router();

router.post("/saveDocument/:userId/:docId", async (req, res) => {
  const { userId, docId } = req.params;

  try {
    connectToDB();
    // Check if document exists
    const document = await Document.findById(docId);
    if (!document) {
      return res.status(404).send("Document not found");
    }

    // Add document id to user's savedDocuments
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    if (!user.savedDocuments.includes(docId)) {
      user.savedDocuments.push(docId);
      await user.save();
    }

    res.status(200).send("Document saved successfully");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/removeDocument/:userId/:docId", async (req, res) => {
  const { userId, docId } = req.params;

  try {
    connectToDB();
    // Check if document exists
    const document = await Document.findById(docId);
    if (!document) {
      return res.status(404).send("Document not found");
    }

    // Remove document id from user's savedDocuments
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    const index = user.savedDocuments.indexOf(docId);
    if (index !== -1) {
      user.savedDocuments.splice(index, 1);
      await user.save();
    }

    res.status(200).send("Document removed successfully");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/savedDocuments/:userId", async (req, res) => {
  try {
    connectToDB();
    const { userId } = req.params;
    const user = await User.findById(userId).populate({
      path: "savedDocuments",
      select: "_id title",
    });

    res.status(200).json(user.savedDocuments);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
