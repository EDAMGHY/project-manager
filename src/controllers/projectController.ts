import { responseObject } from "@/lib";
import { Response } from "express";
import * as CustomError from "@/errors";
import { IFilterExpress, Request } from "@/types";
import { Project } from "@/models";
import { StatusCodes } from "http-status-codes";
import { FilterQuery } from "mongoose";

const stats = ["planning", "active", "completed"];

/**
 *
 * Create a new project
 *
 * @param req: Request
 * @param res: Response
 * @route POST /api/v1/projects
 * @access Authenticated - PERMISSION : CREATE_PROJECT
 */
export const createProject = async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const {
    name,
    description,
    status = "planning",
    startDate,
    endDate,
    budget,
    progress = 0,
  } = req.body;

  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();

  // check if start date is greater than today's date
  if (start < now) {
    throw new CustomError.BadRequestError(
      "Start date should be greater than today's date",
    );
  }

  // check if start date is greater than end date
  if (start > end) {
    throw new CustomError.BadRequestError(
      "Start date should be less than end date",
    );
  }

  // check if progress is between 0 and 100
  if (progress > 100 || progress < 0) {
    throw new CustomError.BadRequestError(
      "Progress should be between 0 and 100",
    );
  }

  // check if status is valid
  if (!stats.includes(status)) {
    throw new CustomError.BadRequestError(
      "Status should be planning, active or completed",
    );
  }

  // create a new project
  const project = await Project.create({
    name,
    description,
    status,
    startDate: start,
    endDate: end,
    budget,
    progress,
    user: userId,
  });

  await project.save();

  res
    .status(StatusCodes.CREATED)
    .json(responseObject("Project created Successfully...", project));
};

/**
 * Get all projects
 *
 * @param req: Request
 * @param res: Response
 * @route GET /api/v1/projects
 * @access Authenticated - PERMISSION : GET_PROJECTS
 */
export const getProjects = async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const {
    name,
    description,
    status,
    startDate,
    endDate,
    "budget.lte": budgetLte,
    "budget.gte": budgetGte,
    "progress.lte": progressLte,
    "progress.gte": progressGte,
    sort,
  } = req.query;
  // Filter setup
  const filters: IFilterExpress[] = [];

  // Add other filters as needed
  if (name) filters.push({ name: { $regex: `.*${name}.*`, $options: "i" } });
  if (description)
    filters.push({
      description: { $regex: `.*${description}.*`, $options: "i" },
    });

  if (status) filters.push({ status: status as string });

  // check if start date is greater than end date
  if (startDate > endDate) {
    throw new CustomError.BadRequestError(
      "Start date should be less than end date",
    );
  }

  // Projects that start on or after the specified startDate
  if (startDate) {
    filters.push({ startDate: { $gte: new Date(startDate as string) } });
  }
  // Projects that end on or before the specified endDate
  if (endDate) {
    filters.push({ endDate: { $lte: new Date(endDate as string) } });
  }

  // Projects with budget less than or equal to the specified budgetLte
  if (budgetLte) filters.push({ budget: { $lte: budgetLte as string } });
  // Projects with budget greater than or equal to the specified budgetGte
  if (budgetGte) filters.push({ budget: { $gte: budgetGte as string } });
  // Projects with progress less than or equal to the specified progressLte
  if (progressLte) filters.push({ progress: { $lte: progressLte as string } });
  // Projects with progress greater than or equal to the specified progressGte
  if (progressGte) filters.push({ progress: { $gte: progressGte as string } });

  //handle Error if no filters are provided
  // "message": "$and/$or/$nor must be a nonempty array
  // eslint-disable-next-line
  let obj: FilterQuery<any> = {};
  if (filters.length > 0) {
    obj = { $and: filters };
  }

  // Sorting setup
  let sorting: string = "createdAt";
  if (sort) sorting = sort.toString();

  const projects = await Project.find({ user: userId, ...obj }).sort(sorting);

  res.status(StatusCodes.OK).json(
    responseObject("Projects Fetched Successfully", {
      length: projects.length,
      results: projects,
    }),
  );
};

/**
 * Get a single project
 *
 * @param req: Request
 * @param res: Response
 * @route GET /api/v1/projects/:id
 * @access Authenticated - PERMISSION : GET_PROJECT
 */
export const getProject = async (req: Request, res: Response) => {
  const { id } = req.params;

  const project = await Project.findById(id);

  if (!project) {
    throw new CustomError.NotFoundError(
      `No project found with the id of ${id}`,
    );
  }

  res
    .status(StatusCodes.OK)
    .json(
      responseObject(
        `Project with the ID:[${id}] Fetched Successfully...`,
        project,
      ),
    );
};

/**
 * Edit a project
 *
 * @param req: Request
 *  @param res: Response
 * @route PUT /api/v1/projects/:id
 * @access Authenticated - PERMISSION : EDIT_PROJECT
 */
export const editProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user.userId;
  const { name, description, status, startDate, endDate, budget, progress } =
    req.body;
  const project = await Project.findOne({ _id: id, user: userId });

  if (!project) {
    throw new CustomError.NotFoundError(
      `No project found with the id of ${id}`,
    );
  }

  const start = startDate ? new Date(startDate) : project.startDate;
  const end = endDate ? new Date(endDate) : project.endDate;
  const now = new Date();

  // check if start date is greater than today's date
  if (start < now) {
    throw new CustomError.BadRequestError(
      "Start date should be greater than today's date",
    );
  }

  // check if start date is greater than end date
  if (start > end) {
    throw new CustomError.BadRequestError(
      "Start date should be less than end date",
    );
  }

  // check if progress is between 0 and 100
  if (progress > 100 || progress < 0) {
    throw new CustomError.BadRequestError(
      "Progress should be between 0 and 100",
    );
  }

  // check if status is valid
  if (status && !stats.includes(status)) {
    throw new CustomError.BadRequestError(
      "Status should be planning, active or completed",
    );
  }

  if (name) project.name = name;
  if (description) project.description = description;
  if (status) project.status = status;
  if (startDate) project.startDate = start;
  if (endDate) project.endDate = end;
  if (budget) project.budget = budget;
  if (progress) project.progress = progress;
  if (userId) project.user = userId;

  await project.save();

  res
    .status(StatusCodes.OK)
    .json(responseObject("Project Updated Successfully...", project));
};

/**
 * Delete a project
 *
 * @param req: Request
 * @param res: Response
 * @route DELETE /api/v1/projects/:id
 * @access Authenticated - PERMISSION : DELETE_PROJECT
 */
export const deleteProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user.userId;
  const project = await Project.findOne({ _id: id, user: userId });

  if (!project) {
    throw new CustomError.NotFoundError(
      `No project found with the id of ${id}`,
    );
  }

  await project.deleteOne();

  res
    .status(StatusCodes.OK)
    .json(
      responseObject(
        `Project with the ID: [${id}] Deleted Successfully...`,
        null,
      ),
    );
};
