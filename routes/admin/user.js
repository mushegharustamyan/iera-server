const { check } = require("express-validator");
const express = require("express");
const router = express.Router();

const verifyAdmin = require("../auth");
const adminUserController = require("../../controllers/admin/user");
const {
  verifyCreate,
  verifyUser,
  verifyIsNotAdmin,
} = require("../../middlewares/admin/user");

router.post(
  "/",
  [
    check("name").notEmpty().withMessage("User name cannot be empty"),

    check("login")
      .notEmpty()
      .withMessage("Login cannot be empty")
      .isLength({ min: 4 })
      .withMessage("Login must be at least 5 charachters"),

    check("password")
      .notEmpty()
      .withMessage("Password cannot be Empty")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 charachters"),
  ],
  [verifyAdmin, verifyCreate],
  adminUserController.create
);
router.delete(
  "/:id",
  [verifyAdmin, verifyUser, verifyIsNotAdmin],
  adminUserController.delete
);
router.put(
  "/:id",
  [
    check("name")
      .optional()
      .notEmpty()
      .withMessage("User name cannot be empty"),

    check("login")
      .optional()
      .notEmpty()
      .withMessage("Login cannot be empty")
      .isLength({ min: 4 })
      .withMessage("Login must be at least 5 characters"),

    check("password")
      .optional()
      .notEmpty()
      .withMessage("Password cannot be empty")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
  ],
  [verifyAdmin, verifyUser ],
  adminUserController.update
);
router.get("/", verifyAdmin, adminUserController.index);
router.get("/:id", [verifyAdmin, verifyUser], adminUserController.show);

module.exports = router;
