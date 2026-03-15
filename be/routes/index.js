import express from "express";
const router = express.Router();

// API root
router.get("/", (req, res) => {
  res.json({ message: "Hello from API!" });
});

export default router;
