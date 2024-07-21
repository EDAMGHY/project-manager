import {
  createProject,
  deleteProject,
  editProject,
  getProject,
  getProjects,
} from "@/controllers";
import { authenticate } from "@/middleware";
import { Router } from "express";

const router = Router();

router
  .route("/")
  .post(authenticate, createProject)
  .get(authenticate, getProjects);

router.get("/:id", authenticate, getProject);

router.put("/:id", authenticate, editProject);

router.delete("/:id", authenticate, deleteProject);

export default router;
