import express from "express";
import { body, param } from "express-validator";
import {
  addProductToCart,
  createCart,
  deleteCart,
  getCartById,
  getCartByUser,
  getCarts,
  updateCart
  updateCartItem,
} from "../controllers/cartController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import isAdmin from "../middlewares/isAdminMiddleware.js";
import validate from "../middlewares/validation.js";
import {
  mongoIdValidation,
  bodyMongoIdValidation,
  quantityValidation,
} from "../middlewares/validators.js";

const router = express.Router();
router.get("/cart", authMiddleware, isAdmin, getCarts);
router.get(
  "/cart/user/:id",
  authMiddleware,
  [mongoIdValidation("id", "User ID")],
  validate,
  getCartByUser
);

router.post(
  "/cart/add-product",
  authMiddleware,
  [
    bodyMongoIdValidation("userId", "User ID"),
    bodyMongoIdValidation("productId", "Product ID"),
    quantityValidation("quantity", true),
  ],
  validate,
  addProductToCart
);


router.get(
  "/cart/:id",
  authMiddleware,
  isAdmin,
  [mongoIdValidation("id", "Cart ID")],
  validate,
  getCartById
);
router.post(
  "/cart",
  authMiddleware,
  [
    bodyMongoIdValidation("user", "User"),
    body("products")
      .notEmpty()
      .withMessage("Products are required")
      .isArray({ min: 1 })
      .withMessage("Products must be a non-empty array"),
    bodyMongoIdValidation("products.*.product", "Product ID"),
    quantityValidation("products.*.quantity"),
  ],
  validate,
  createCart
);

rutasNuevasM ???
router.put(
  "/cart/:id",
  authMiddleware,
  [
    mongoIdValidation("id", "Cart ID"),
    bodyMongoIdValidation("user", "User ID", true),
    body("products")
      .optional()
      .isArray({ min: 1 })
      .withMessage("Products must be a non-empty array"),
    bodyMongoIdValidation("products.*.product", "Product ID", true),
    quantityValidation("products.*.quantity", true),
  ],
  validate,
  updateCart
);

router.delete(
  "/cart/:id",
  authMiddleware,
  [mongoIdValidation("id", "Cart ID")],
  validate,
  deleteCart
);

router.put("/cart/update-item",
  authMiddleware,
  [bodyMongoIdValidation("userId","User ID"),
  [bodyMongoIdValidation("productID","Product ID"),
    quantityValidation("quantity",true),
    ],
    validate,
    updateCartItem,
  );

router.delete(
  "/car/remove-item/:productId", authMiddleware,[
  mongoIdValidation("userId","User ID"),
]);


export default router;
