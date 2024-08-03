import { getLog, getLogs, deleteLog } from "@/controllers";
import { authenticate, checkPermissions } from "@/middleware";
import { Router } from "express";

const router = Router();

router.get("/", authenticate, checkPermissions(), getLogs);

router.get("/:id", authenticate, checkPermissions(), getLog);

router.delete("/:id", authenticate, checkPermissions(), deleteLog);

export default router;
