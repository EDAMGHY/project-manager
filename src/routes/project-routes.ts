import {
  createProject,
  deleteProject,
  editProject,
  getProject,
  getProjects,
} from "@/controllers";
import { authenticate, checkPermissions } from "@/middleware";
import { Router } from "express";

const router = Router();

router
  .route("/")
  .post(authenticate, checkPermissions(), createProject)
  .get(authenticate, checkPermissions(), getProjects);

router.get("/:id", authenticate, checkPermissions(), getProject);

router.put("/:id", authenticate, checkPermissions(), editProject);

router.delete("/:id", authenticate, checkPermissions(), deleteProject);

export default router;
