import * as CustomError from "@/errors";
import { isTokenValid } from "@/utils";
import { Request } from "@/types";
import { NextFunction, Response } from "express";
import { Role, RolePermission } from "@/models";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.signedCookies.token;

  if (!token) {
    throw new CustomError.UnauthenticatedError(
      "Nice Try! You need to be logged in to access this route...",
    );
  }

  try {
    const user = isTokenValid({ token });
    // eslint-disable-next-line
    req.user = user as any;
    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError("Authentication Invalid");
  }
};

export const checkPermissions = (
  HCPermission?: string,
  onlyOwner: boolean = false,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const permission = HCPermission || req.permission;

    if (!user) {
      throw new CustomError.UnauthenticatedError(
        "Nice Try! You need to be logged in to access this route...",
      );
    }

    try {
      const permissions = await RolePermission.find({
        role: user.role,
      }).populate("permission");

      const hasPermission = permissions.some(
        (perm) => perm.permission.name === permission,
      );

      if (onlyOwner) {
        const ownerRole = await Role.findOne({ name: "OWNER" });
        if (user?.role !== ownerRole?.id) {
          throw new CustomError.UnauthorizedError(
            `Nice Try! You need to be the [OWNER] to access the route...`,
          );
        }
      } else {
        if (!hasPermission) {
          throw new CustomError.UnauthorizedError(
            `Nice Try! You need to have this permission [${permission}] to access the route...`,
          );
        }
      }

      next();
    } catch (error) {
      console.log({ error });
      throw new CustomError.UnauthorizedError(
        error?.message || "Access Denied! Please check your permissions...",
      );
    }
  };
};
