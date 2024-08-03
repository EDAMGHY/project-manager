import { getPagination, responseObject } from "@/lib";
import { Response } from "express";
import { IFilterExpress, ISortExpress, Request } from "@/types";
import { Permission } from "@/models";
import { StatusCodes } from "http-status-codes";
import * as CustomError from "@/errors";

/**
 * Create a permission
 *
 * @param req: Request
 * @param res: Response
 * @route POST /api/v1/permissions
 * @access Authenticated - PERMISSION : CREATE_PERMISSION
 */
export const createPermission = async (req: Request, res: Response) => {
  res.json(
    responseObject("Create a Permission ", {
      permission: req.permission,
    }),
  );
};

/**
 * Get all permissions
 *
 * @param req: Request
 * @param res: Response
 * @route GET /api/v1/permissions
 * @access Authenticated - PERMISSION : GET_PERMISSIONS
 */
export const getPermissions = async (req: Request, res: Response) => {
  const {
    name,
    description,
    sort = "createdAt",
    order = "desc",
    perPage = 100,
    page = 1,
  } = req.query;
  // Filter setup
  const filters: IFilterExpress[] = [];

  // Add other filters as needed
  if (name) filters.push({ name: { $regex: `.*${name}.*`, $options: "i" } });
  if (description)
    filters.push({
      description: { $regex: `.*${description}.*`, $options: "i" },
    });

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

  const length = await Permission.countDocuments(obj);

  const { limit, skip, total } = getPagination(+page, +perPage, length);

  // fetch permissions
  const permissions = await Permission.find(obj)
    .sort(sorting)
    .skip(skip)
    .limit(limit);

  res.status(StatusCodes.OK).json(
    responseObject("Permissions Fetched Successfully...", {
      length: length,
      current: +page,
      total,
      permissions,
      permission: req.permission,
    }),
  );
};

/**
 * Get a single permission
 *
 * @param req: Request
 * @param res: Response
 * @route GET /api/v1/permissions/:id
 * @access Authenticated - PERMISSION : GET_PERMISSION
 */
export const getPermission = async (req: Request, res: Response) => {
  const permissionId = req.params?.id;

  const permission = await Permission.findById(permissionId);

  if (!permission) {
    throw new CustomError.NotFoundError(
      `No permission found with the id of ${permissionId}`,
    );
  }

  res
    .status(StatusCodes.OK)
    .json(
      responseObject(
        `Permission with the ID:[${permissionId}] Fetched Successfully...`,
        permission,
      ),
    );
};

/**
 * edit a permission
 *
 * @param req: Request
 * @param res: Response
 * @route PUT /api/v1/permissions/:id
 * @access Authenticated - PERMISSION : EDIT_PERMISSION
 */

export const editPermission = async (req: Request, res: Response) => {
  const permissionId = req.params?.id;
  const { description } = req.body;

  const permission = await Permission.findById(permissionId);

  if (!permission) {
    throw new CustomError.NotFoundError(
      `No permission found with the id of ${permissionId}`,
    );
  }

  // Update permission
  // if (name) permission.name = name;
  if (description) permission.description = description;

  // Save permission
  await permission.save();

  res
    .status(StatusCodes.OK)
    .json(
      responseObject(
        `Permission with the ID:[${permissionId}] Edited Successfully...`,
        permission,
      ),
    );
};

/**
 * Delete a permission
 *
 * @param req: Request
 * @param res: Response
 * @route DELETE /api/v1/permissions/:id
 * @access Authenticated - PERMISSION : DELETE_PERMISSION
 */
export const deletePermission = (req: Request, res: Response) => {
  res.json(
    responseObject("DELETE a Permission", { permission: req.permission }),
  );
};
