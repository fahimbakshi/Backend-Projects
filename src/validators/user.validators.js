import { body } from "express-validator";

const userLoginValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("username").trim().optional(),
    body("password").notEmpty().withMessage("Password is required"),
  ];
};

const userRegisterValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLowercase()
      .withMessage("Username must be in lowercase")
      .isLength({ min: 3 })
      .withMessage("Username must be atleast 3 characters long"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at most 8 characters long"),
    body("fullname").trim().notEmpty().withMessage("Fulname is required"),
  ];
};

const userUpdateAccountDetailsValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("fullname").trim().notEmpty().withMessage("Fullname is required"),
  ];
}

const userUpdatePassword = () => {
  return [
    body("newPassword")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at most 8 characters long"),
    body("oldPassword")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ max: 8 })
      .withMessage("Password must be at most 8 characters long"),
  ];
}
export { userLoginValidator, userRegisterValidator,userUpdateAccountDetailsValidator,userUpdatePassword };