import { EDIT_USER, EDIT_USER_ROLE } from "@/config";
import {
  getUser,
  deleteUser,
  getMe,
  getUsers,
  editUser,
  editUserOWNER,
} from "@/controllers";
import { authenticate, checkPermissions } from "@/middleware";
import { Router } from "express";

const router = Router();

router.get("/", authenticate, checkPermissions(), getUsers);

router.get("/getMe", authenticate, getMe);

router.put("/editMe", authenticate, checkPermissions(EDIT_USER), editUser);

router.put(
  "/role/:id",
  authenticate,
  checkPermissions(EDIT_USER_ROLE),
  editUserOWNER,
);

router.get("/:id", authenticate, checkPermissions(), getUser);

router.delete("/:id", authenticate, checkPermissions(), deleteUser);

export default router;
