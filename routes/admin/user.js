const { check } = require("express-validator");
const express = require("express");
const router = express.Router();

const adminUserController = require("../../controllers/admin/user");
const { verifyCreate, verifyUser } = require("../../middlewares/admin/user");

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
  [verifyCreate],
  adminUserController.create
);
router.delete("/:id", [verifyUser], adminUserController.delete);
router.patch(
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
  [verifyUser],
  adminUserController.update
);
router.get("/", adminUserController.index);
router.get("/:id", [verifyUser], adminUserController.show);

module.exports = router;
