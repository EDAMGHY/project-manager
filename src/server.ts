import "dotenv/config";
import "express-async-errors";

import express, { Request, Response, Application } from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import rateLimiter from "express-rate-limit";
import cookieParser from "cookie-parser";
import colors from "colors";

import { connectDB } from "@/config";
import { env } from "@/config";
import {
  errorHandlerMiddleware,
  getPermissions,
  notFoundMiddleware,
} from "@/middleware";
import { responseObject } from "@/lib";
import {
  userRoutes,
  roleRoutes,
  permissionRoutes,
  projectRoutes,
  taskRoutes,
  authRoutes,
} from "@/routes";

const app: Application = express();

colors.enable();

connectDB();

app.use(morgan("tiny"));
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  }),
);
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(env.JWT_SECRET));

app.get("/", (req: Request, res: Response) => {
  res.json(responseObject("Entry Point The API is Running..."));
});

// DYNAMICALLY ADDING PERMISSIONS
app.use("/api/v1/*", getPermissions);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/roles", roleRoutes);
app.use("/api/v1/permissions", permissionRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/tasks", taskRoutes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const PORT = env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
