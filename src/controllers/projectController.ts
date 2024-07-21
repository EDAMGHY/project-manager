import { responseObject } from "@/lib";
import { Response } from "express";
import { Request } from "@/types";

export const createProject = (req: Request, res: Response) => {
  res.json(responseObject("Create a Project ", req.permission));
};

export const getProjects = (req: Request, res: Response) => {
  res.json(responseObject("GET all Projects", req.permission));
};

export const getProject = (req: Request, res: Response) => {
  res.json(responseObject("GET a Project", req.permission));
};

export const editProject = (req: Request, res: Response) => {
  res.json(responseObject("Edit a Project", req.permission));
};

export const deleteProject = (req: Request, res: Response) => {
  res.json(responseObject("DELETE a Project", req.permission));
};
