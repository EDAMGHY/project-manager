import { login, logout, register } from "@/controllers";
import { authenticate } from "@/middleware";
import { Router } from "express";

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.post("/logout", authenticate, logout);

export default router;
