import { responseObject } from "@/lib";
import { Response } from "express";
import { Request } from "@/types";

export const createTask = (req: Request, res: Response) => {
  res.json(responseObject("Create a Task", { perm: req.permission }));
};

export const getTasks = (req: Request, res: Response) => {
  res.json(responseObject("GET all Tasks", req.permission));
};

export const getTask = (req: Request, res: Response) => {
  res.json(responseObject("GET a Task", req.permission));
};

export const editTask = (req: Request, res: Response) => {
  res.json(responseObject("Edit a Task", req.permission));
};

export const deleteTask = (req: Request, res: Response) => {
  res.json(responseObject("DELETE a Task", req.permission));
};
