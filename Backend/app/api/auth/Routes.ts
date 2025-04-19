import express from "express";
import { Auth } from "./Controllers";
import { AuthVal } from "./AuthValidator";
import { GlobalValidation } from "../../middleware/validationGlobal";

const router = express.Router();

router.post("/login", GlobalValidation(AuthVal.login), Auth.login);
router.post("/register",GlobalValidation(AuthVal.register), Auth.register);

export default router;
