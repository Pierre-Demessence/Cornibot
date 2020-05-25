import express from "express";
import path from "path";

const router = express.Router();

router.use("", express.static(path.join(__dirname, "../../../admin/dist/")));

export default router;
