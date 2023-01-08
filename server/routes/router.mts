import express from "express";
import v1 from "./api/v1.mjs";

const router = express.Router();

router.use("/api/v1", v1);

export default router;
