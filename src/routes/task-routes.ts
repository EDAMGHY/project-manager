import {
  createTask,
  deleteTask,
  editTask,
  getTask,
  getTasks,
} from "@/controllers";
import { authenticate, checkPermissions } from "@/middleware";
import { Router } from "express";

const router = Router();

router
  .route("/")
  .post(authenticate, checkPermissions(), createTask)
  .get(authenticate, checkPermissions(), getTasks);

router.get("/:id", authenticate, checkPermissions(), getTask);

router.put("/:id", authenticate, checkPermissions(), editTask);

router.delete("/:id", authenticate, checkPermissions(), deleteTask);

export default router;
