import express from "express";
import UserSession from "../model/session.model";
import CollaboratedDoc from "../model/CollaborateDocs.model";
import Document from "../model/Document.model";
import { connectToDB } from "../db";
import { ObjectId } from "mongodb";

const router = express.Router();

router.post("/collab_doc/addUser/:docId", async (req, res) => {
  try {
    connectToDB();

    const { userId } = req.body;
    const { docId } = req.params;
    console.log(userId, docId);

    // Check if the document exists
    const document = await Document.findById(docId);
    if (!document) {
      return res.status(404).send({ message: "Document not found" });
    }

    // Check if the document is already in the CollaboratedDoc collection
    const existingCollaboration = await CollaboratedDoc.findOne({
      documentId: docId,
    });

    if (existingCollaboration) {
      // Check if the user is already a collaborator
      if (existingCollaboration.userId.includes(userId)) {
        return res
          .status(400)
          .send({ message: "User is already a collaborator" });
      }

      // Add the user to the existing collaboration
      existingCollaboration.userId.push(userId);
      await existingCollaboration.save();
      res.status(200).send(existingCollaboration);
    } else {
      // Create a new collaboration
      const collaboration = new CollaboratedDoc({
        documentId: docId,
        userId: [userId],
      });
      await collaboration.save();
      res.status(201).send(collaboration);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

interface Collaboration {
  documentId: string;
  userId: ObjectId[];
}

router.get("/collab_docs/getDocs/:userId", async (req, res) => {
  try {
    connectToDB();

    const { userId } = req.params;

    const collaborations = await CollaboratedDoc.find({
      userId: userId,
    }).populate("documentId");

    // console.log(collaborations);

    const documents = collaborations.map((collaboration: Collaboration) => {
      return {
        documentId: collaboration.documentId,
        userId: collaboration.userId,
      };
    });

    res.status(200).json(documents);
  } catch (error) {
    res.status(500).send(error);
  }
});
module.exports = router;
