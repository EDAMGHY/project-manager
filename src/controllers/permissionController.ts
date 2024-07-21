import { responseObject } from "@/lib";
import { Response } from "express";
import { Request } from "@/types";

export const createPermission = (req: Request, res: Response) => {
  res.json(
    responseObject("Create a Permission ", { permission: req.permission }),
  );
};

export const getPermissions = (req: Request, res: Response) => {
  res.json(
    responseObject("GET all Permissions", { permission: req.permission }),
  );
};

export const getPermission = (req: Request, res: Response) => {
  res.json(responseObject("GET a Permission", { permission: req.permission }));
};

export const editPermission = (req: Request, res: Response) => {
  res.json(responseObject("Edit a Permission", { permission: req.permission }));
};

export const deletePermission = (req: Request, res: Response) => {
  res.json(
    responseObject("DELETE a Permission", { permission: req.permission }),
  );
};
