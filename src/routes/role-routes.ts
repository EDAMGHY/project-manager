import {
  createRole,
  deleteRole,
  editRole,
  getRole,
  getRoles,
} from "@/controllers";
import { authenticate, checkPermissions } from "@/middleware";
import { Router } from "express";

const router = Router();

router
  .route("/")
  .post(authenticate, checkPermissions, createRole)
  .get(authenticate, checkPermissions, getRoles);

router.get("/:id", authenticate, checkPermissions, getRole);

router.put("/:id", authenticate, checkPermissions, editRole);

router.delete("/:id", authenticate, checkPermissions, deleteRole);

export default router;
