import {
  getPagination,
  prioritiesEnum,
  responseObject,
  taskStatsEnum,
} from "@/lib";
import { Response } from "express";
import { IFilterExpress, ISortExpress, Request } from "@/types";
import * as CustomError from "@/errors";
import { StatusCodes } from "http-status-codes";
import { Task } from "@/models";

/**
 * Create a new task
 *
 * @param req : Request
 * @param res : Response
 * @route POST /api/v1/tasks
 * @access Authenticated - PERMISSION : CREATE_TASK
 */
export const createTask = async (req: Request, res: Response) => {
  const {
    name,
    description,
    dueDate,
    status = "started",
    priority = "low",
    project,
  } = req.body;

  const now = new Date();
  const date = new Date(dueDate);

  // check if start date is greater than today's date
  if (date < now) {
    throw new CustomError.BadRequestError(
      "Due date should be greater than today's date",
    );
  }

  // check if status is valid
  if (!taskStatsEnum.includes(status)) {
    throw new CustomError.BadRequestError(
      "Status should be started, pending, in progress or completed",
    );
  }
  // check if priority is valid
  if (!prioritiesEnum.includes(priority)) {
    throw new CustomError.BadRequestError(
      "Priority should be low, medium or high",
    );
  }

  const task = await Task.create({
    name,
    description,
    status,
    priority,
    project,
  });

  if (dueDate) task.dueDate = date;

  await task.save();

  res.status(StatusCodes.CREATED).json(
    responseObject("Task Created Successfully...", {
      task,
      perm: req.permission,
    }),
  );
};

/**
 * Get all tasks
 *
 * @param req : Request
 * @param res : Response
 * @route GET /api/v1/tasks
 * @access Authenticated - PERMISSION : GET_TASKS
 */
export const getTasks = async (req: Request, res: Response) => {
  const {
    name,
    description,
    dueDate,
    dueDateFilter = "after", // before, after
    status,
    priority,
    project,
    sort = "createdAt",
    order = "desc",
    perPage = 100,
    page = 1,
  } = req.query;

  const now = new Date();
  const due = new Date(dueDate as string);

  // check if start date is greater than today's date
  if (due < now) {
    throw new CustomError.BadRequestError(
      "Due date should be greater than today's date",
    );
  }

  // check if dueDateFilter is valid
  const validDueDateFilters = ["before", "after"];
  if (dueDateFilter && !validDueDateFilters.includes(dueDateFilter as string)) {
    throw new CustomError.BadRequestError(
      "dueDateFilter should be 'before' or 'after'",
    );
  }

  // check if status is valid
  if (status && !taskStatsEnum.includes(status as string)) {
    throw new CustomError.BadRequestError(
      "Status should be started, pending, in progress or completed",
    );
  }
  // check if priority is valid
  if (priority && !prioritiesEnum.includes(priority as string)) {
    throw new CustomError.BadRequestError(
      "Priority should be low, medium or high",
    );
  }

  // Filter setup
  const filters: IFilterExpress[] = [];

  // Add other filters as needed
  if (name) filters.push({ name: { $regex: `.*${name}.*`, $options: "i" } });
  if (description)
    filters.push({
      description: { $regex: `.*${description}.*`, $options: "i" },
    });
  if (status) filters.push({ status: status as string });
  if (priority) filters.push({ priority: priority as string });
  if (project) filters.push({ project: project as string });

  // Apply due date filter based on dueDateFilter parameter
  if (dueDate) {
    if (dueDateFilter === "before") {
      filters.push({ dueDate: { $lte: due } });
    } else if (dueDateFilter === "after") {
      filters.push({ dueDate: { $gte: due } });
    }
  }

  //handle Error if no filters are provided
  // "message": "$and/$or/$nor must be a nonempty array",
  let obj = {};
  if (filters.length > 0) {
    obj = { $and: filters };
  }

  // Sorting setup
  const key = sort.toString();
  const value = order as "desc" | "asc";
  const sorting: ISortExpress = { [key]: value };

  const length = await Task.countDocuments(obj);

  const { limit, skip, total } = getPagination(+page, +perPage, length);

  // fetch tasks
  const tasks = await Task.find(obj).sort(sorting).skip(skip).limit(limit);

  res.status(StatusCodes.OK).json(
    responseObject("Tasks Fetched Successfully...", {
      length,
      total,
      current: +page,
      tasks,
      permission: req.permission,
    }),
  );
};

/**
 * Get a single task
 * @param req : Request
 * @param res : Response
 * @route GET /api/v1/tasks/:id
 * @access Authenticated - PERMISSION : GET_TASK
 */
export const getTask = async (req: Request, res: Response) => {
  const taskId = req.params?.id;

  const task = await Task.findById(taskId);

  if (!task) {
    throw new CustomError.NotFoundError(
      `No task found with the id of ${taskId}`,
    );
  }

  res.status(StatusCodes.OK).json(
    responseObject(`Task with ID: ${taskId} Fetched Successfully...`, {
      task,
      permission: req.permission,
    }),
  );
};

/**
 * Edit a task
 *
 * @param req : Request
 * @param res : Response
 * @route PUT /api/v1/tasks/:id
 * @access Authenticated - PERMISSION : EDIT_TASK
 */
export const editTask = async (req: Request, res: Response) => {
  const taskId = req.params?.id;
  const {
    name,
    description,
    dueDate,
    status = "started",
    priority = "low",
    project,
  } = req.body;

  const now = new Date();
  const date = new Date(dueDate);

  const task = await Task.findById(taskId);

  if (!task) {
    throw new CustomError.NotFoundError(
      `No task found with the id of ${taskId}`,
    );
  }

  // check if start date is greater than today's date
  if (date < now) {
    throw new CustomError.BadRequestError(
      "Due date should be greater than today's date",
    );
  }

  // check if status is valid
  if (!taskStatsEnum.includes(status)) {
    throw new CustomError.BadRequestError(
      "Status should be started, pending, in progress or completed",
    );
  }
  // check if priority is valid
  if (!prioritiesEnum.includes(priority)) {
    throw new CustomError.BadRequestError(
      "Priority should be low, medium or high",
    );
  }

  if (name) task.name = name;
  if (description) task.description = description;
  if (status) task.status = status;
  if (priority) task.priority = priority;
  if (project) task.project = project;
  if (dueDate) task.dueDate = date;

  await task.save();

  res.status(StatusCodes.OK).json(
    responseObject("Task Edited Successfully...", {
      task,
      permission: req.permission,
    }),
  );
};

/**
 * Delete a task
 *
 * @param req : Request
 * @param res : Response
 * @route DELETE /api/v1/tasks/:id
 * @access Authenticated - PERMISSION : DELETE_TASK
 */
export const deleteTask = async (req: Request, res: Response) => {
  const taskId = req.params?.id;

  const task = await Task.findById(taskId);

  if (!task) {
    throw new CustomError.NotFoundError(
      `No task found with the id of ${taskId}`,
    );
  }

  await task.deleteOne();

  res
    .status(StatusCodes.OK)
    .json(
      responseObject(
        `Task with the ID: [${taskId}] Deleted Successfully...`,
        req.permission,
      ),
    );
};
