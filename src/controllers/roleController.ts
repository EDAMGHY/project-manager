import { responseObject } from "@/lib";
import { Response } from "express";
import { Request } from "@/types";
import { Role } from "@/models";

export const createRole = async (req: Request, res: Response) => {
  res.json(responseObject("Create a Role ", { permission: req.permission }));
};

export const getRoles = async (req: Request, res: Response) => {
  const roles = await Role.find();
  res.json(
    responseObject("GET all Roles", { roles, permission: req.permission }),
  );
};

export const getRole = async (req: Request, res: Response) => {
  res.json(responseObject("GET a Role", { permission: req.permission }));
};

export const editRole = async (req: Request, res: Response) => {
  res.json(responseObject("Edit a Role", { permission: req.permission }));
};

export const deleteRole = async (req: Request, res: Response) => {
  res.json(responseObject("DELETE a Role", { permission: req.permission }));
};
