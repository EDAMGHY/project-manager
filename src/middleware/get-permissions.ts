import { getPermission } from "@/lib";
// import { Permission } from "@/models";
import { METHOD } from "@/types";
import { Request, Response, NextFunction } from "express";

export const getPermissions = async (
  req: Request & { permission: string },
  res: Response,
  next: NextFunction,
) => {
  const permission = getPermission(req.baseUrl, req.method as METHOD);
  req.permission = permission;
  next();
};
