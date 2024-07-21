import {
  createPermission,
  deletePermission,
  editPermission,
  getPermission,
  getPermissions,
} from "@/controllers";
import { authenticate, checkPermissions } from "@/middleware";
import { Router } from "express";

const router = Router();

router
  .route("/")
  .post(authenticate, checkPermissions, createPermission)
  .get(authenticate, checkPermissions, getPermissions);

router.get("/:id", authenticate, checkPermissions, getPermission);

router.put("/:id", authenticate, checkPermissions, editPermission);

router.delete("/:id", authenticate, checkPermissions, deletePermission);

export default router;
