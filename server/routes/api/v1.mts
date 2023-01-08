import express from "express";

const router = express.Router();

router.get("/hello", (_req, res) => res.json("hello"));

export default router;
