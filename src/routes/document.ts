import express, { Request, Response } from "express";
import Document from "../model/Document.model";
import { connectToDB } from "../db";
import CollaboratedDoc from "../model/CollaborateDocs.model";

const router = express.Router();

// // GET /documents/:id
// router.get("/documents/:id", async (req: Request, res: Response) => {
//   const document = await Document.findById(req.params.id);
//   if (!document) return res.status(404).send("Document not found");
//   res.send(document);
// });

// POST /documents
router.post("/documents", async (req: Request, res: Response) => {
  try {
    connectToDB();
    const document = new Document({
      content: req.body.content,
      title: req.body.title,
      owner: req.body.owner,
      lastModified: new Date(),
    });
    await document.save();
    const collaboration = new CollaboratedDoc({
      documentId: document._id,
      userId: [req.body.owner],
    });
    await collaboration.save();

    res.status(201).send(document);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "An error occurred while creating the document." });
  }
});

// PUT /documents/:id
router.put("/documents/:id", async (req: Request, res: Response) => {
  console.log(req.params.id);
  connectToDB();
  const document = await Document.findByIdAndUpdate(
    req.params.id,
    {
      content: req.body.content,
      lastModified: new Date(),
    },
    { new: true }
  );
  if (!document) return res.status(404).send("Document not found");
  res.send(document);
});

// DELETE /documents/:id
router.delete("/documents/:id", async (req: Request, res: Response) => {
  try {
    connectToDB();
    const document = await Document.findByIdAndDelete(req.params.id);
    if (!document) return res.status(404).send("Document not found");
    res.send(document);
  } catch (error) {
    console.error(error);
  }
});

// UPDATE TITLE
router.put("/document/:docId", async (req, res) => {
  const { docId } = req.params;
  const { title } = req.body;

  try {
    connectToDB();
    const document = await Document.findByIdAndUpdate(
      docId,
      { title },
      { new: true }
    );
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.json(document);
  } catch (error) {
    res.status(500).json({ message: "Error updating document", error });
  }
});
router.get("/documents/:userId", async (req, res) => {
  try {
    connectToDB();
    const userId = req.params.userId;
    const documents = await Document.find({ owner: userId }, "_id title");
    res.json(documents.map((doc) => ({ id: doc._id, title: doc.title })));
  } catch (error) {
    res.status(500).json({ message: "Error getting documents", error });
  }
});

module.exports = router;
