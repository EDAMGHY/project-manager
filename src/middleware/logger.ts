import { Response, NextFunction } from "express";
import { Request } from "@/types"; // Adjust the import path as necessary
import { Logger, Role } from "@/models"; // Adjust the import path as necessary

export async function logErrors(
  //eslint-disable-next-line
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req?.user) {
    return next(err);
  }

  const roleId = req?.user?.role;
  const role = await Role.findById(roleId);

  if ((role?.name as string) === "OWNER") {
    return next(err);
  }

  const log = {
    action: "Error",
    description: err.message,
    user: req?.user?.userId,
    role: role?.name,
    ipAddress: req.ip,
    method: req.method,
    endpoint: req.originalUrl,
    statusCode: res.statusCode,
    stack: err.stack,
    userAgent: req.get("User-Agent"),
  };

  try {
    await Logger.create(log);
  } catch (error) {
    console.error("Error saving error log:", error);
  }

  next(err);
}
