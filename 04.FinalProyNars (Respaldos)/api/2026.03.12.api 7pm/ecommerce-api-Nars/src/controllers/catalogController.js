import { MATERIALS, DESIGNS, STONES } from "../config/catalog.js";
import Category from "../models/category.js";

export async function getCatalogMeta(req, res, next) {
  try {
    const categories = await Category.find().sort({ name: 1 }).select("name _id").lean();
    res.json({ materials: MATERIALS, designs: DESIGNS, stones: STONES, categories });
  } catch (err) {
    next(err);
  }
}
