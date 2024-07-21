import {
  createTask,
  deleteTask,
  editTask,
  getTask,
  getTasks,
} from "@/controllers";
import { authenticate } from "@/middleware";
import { Router } from "express";

const router = Router();

router.route("/").post(authenticate, createTask).get(authenticate, getTasks);

router.get("/:id", authenticate, getTask);

router.put("/:id", authenticate, editTask);

router.delete("/:id", authenticate, deleteTask);

export default router;
