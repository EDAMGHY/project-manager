import { getPagination, responseObject } from "@/lib";
import { Response } from "express";
import { IFilterExpress, ISortExpress, Request } from "@/types";
import { Logger } from "@/models";
import { StatusCodes } from "http-status-codes";
import * as CustomError from "@/errors";

/**
 * Get all logs
 *
 * @param req: Request
 * @param res: Response
 * @route GET /api/v1/logs
 * @access Authenticated - PERMISSION : GET_LOGS
 */
export const getLogs = async (req: Request, res: Response) => {
  const {
    action,
    description,
    role,
    method,
    statusCode,
    endpoint,
    sort = "createdAt",
    order = "desc",
    perPage = 100,
    page = 1,
  } = req.query;
  // Filter setup
  const filters: IFilterExpress[] = [];

  // Add other filters as needed
  if (action)
    filters.push({ action: { $regex: `.*${action}.*`, $options: "i" } });
  if (description)
    filters.push({
      description: { $regex: `.*${description}.*`, $options: "i" },
    });
  if (endpoint)
    filters.push({
      endpoint: { $regex: `.*${endpoint}.*`, $options: "i" },
    });
  if (method) filters.push({ method: method as string });
  if (statusCode) filters.push({ statusCode: statusCode as string });
  if (role) filters.push({ role: role as string });

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

  const length = await Logger.countDocuments(obj);

  const { limit, skip, total } = getPagination(+page, +perPage, length);

  // fetch logs
  const logs = await Logger.find(obj)
    .sort(sorting)
    .skip(skip)
    .limit(limit)
    .populate("user", "name username email role createdAt");

  res.status(StatusCodes.OK).json(
    responseObject("Logs Fetched Successfully...", {
      length: length,
      current: +page,
      total,
      logs,
      permission: req.permission,
    }),
  );
};

/**
 * Get a single log
 *
 * @param req: Request
 * @param res: Response
 * @route GET /api/v1/logs/:id
 * @access Authenticated - PERMISSION : GET_LOG
 */
export const getLog = async (req: Request, res: Response) => {
  const logId = req.params?.id;

  const log = await Logger.findById(logId);

  if (!log) {
    throw new CustomError.NotFoundError(`No Log found with the id of ${logId}`);
  }

  res
    .status(StatusCodes.OK)
    .json(
      responseObject(`log with the ID:[${logId}] Fetched Successfully...`, log),
    );
};

/**
 * Delete a log
 *
 * @param req: Request
 * @param res: Response
 * @route DELETE /api/v1/logs/:id
 * @access Authenticated - PERMISSION : DELETE_LOG
 */
export const deleteLog = async (req: Request, res: Response) => {
  const logId = req.params?.id;

  const log = await Logger.findById(logId);

  if (!log) {
    throw new CustomError.NotFoundError(`No Log found with the id of ${logId}`);
  }

  await log.deleteOne();

  res
    .status(StatusCodes.OK)
    .json(
      responseObject(
        `log with the ID:[${logId}] has been Deleted Successfully...`,
      ),
    );
};
