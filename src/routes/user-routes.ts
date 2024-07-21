import { getUser, deleteUser, getMe, getUsers } from "@/controllers";
import { authenticate, checkPermissions } from "@/middleware";
import { Router } from "express";

const router = Router();

router.get("/", authenticate, checkPermissions, getUsers);

router.get("/getMe", authenticate, getMe);

router.get("/:id", authenticate, checkPermissions, getUser);

router.delete("/:id", authenticate, checkPermissions, deleteUser);

export default router;
