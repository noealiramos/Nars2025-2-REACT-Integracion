import { Router } from "express";
import { getCatalogMeta } from "../controllers/catalogController.js";

const router = Router();
router.get("/meta", getCatalogMeta);

export default router;
