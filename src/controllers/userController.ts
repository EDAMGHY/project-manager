import { responseObject } from "@/lib";
import * as CustomError from "@/errors";
import { Response } from "express";
import { IFilterExpress, ISortExpress, Request } from "@/types";
import { Project, Role, RolePermission, Task, User } from "@/models";
import { StatusCodes } from "http-status-codes";

/**
 *
 * Get all users
 *
 * @param req: Request
 * @param res: Response
 * @route GET /api/v1/users
 * @access Authenticated - PERMISSION : GET_USERS
 */
export const getUsers = async (req: Request, res: Response) => {
  const {
    role,
    name,
    email,
    username,
    sort = "createdAt",
    order = "desc",
  } = req.query;
  // Filter setup
  const filters: IFilterExpress[] = [];

  // Add other filters as needed
  if (name) filters.push({ name: { $regex: `.*${name}.*`, $options: "i" } });
  if (username)
    filters.push({ username: { $regex: `.*${username}.*`, $options: "i" } });
  if (email) filters.push({ email: { $regex: `.*${email}.*`, $options: "i" } });
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

  const users = await User.find(obj)
    .populate("role")
    .select("-password")
    .sort(sorting);

  res.status(StatusCodes.OK).json(
    responseObject("Users fetched successfully", {
      length: users.length,
      results: users,
      permission: req.permission,
    }),
  );
};

/**
 *
 * Get current user
 *
 * @param req: Request
 * @param res: Response
 * @route GET /api/v1/users/getMe
 * @access Authenticated
 */
export const getMe = async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new CustomError.UnauthenticatedError(
      "No user found in the request...",
    );
  }

  const user = await User.findById(userId).select("-password");

  const permissions = await RolePermission.find({ role: user.role }).populate(
    "permission",
  );

  res.status(StatusCodes.OK).json(
    responseObject("Current User Fetched Successfully...", {
      user,
      permissions: permissions.map((perm) => perm?.permission?.name.toString()),
      permission: req.permission,
    }),
  );
};

/**
 *
 * Get a single user
 *
 * @param req: Request
 * @param res: Response
 * @route GET /api/v1/users/:id
 * @access Authenticated - PERMISSION : GET_USER
 */
export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await User.findById(id).select("-password");

  if (!user) {
    throw new CustomError.NotFoundError(`No user found with the id of ${id}`);
  }

  res.status(StatusCodes.OK).json(
    responseObject(`User with ID: ${id} Fetched Successfully...`, {
      user,
      permission: req.permission,
    }),
  );
};

/**
 *
 * EDIT a user
 *
 * @param req: Request
 * @param res: Response
 * @route put /api/v1/users/:id
 * @access Authenticated - PERMISSION : EDIT_USER
 */
export const editUser = async (req: Request, res: Response) => {
  const { userId: id } = req.user;
  const { name, username, email } = req.body;

  const user = await User.findById(id).select("-password");

  if (!user) {
    throw new CustomError.NotFoundError(`No user found with the id of ${id}`);
  }

  if (user?.id !== req.user?.userId) {
    throw new CustomError.UnauthorizedError(
      `Not authorized to edit this user...`,
    );
  }

  if (name) user.name = name;
  if (username) user.username = username;
  if (email) user.email = email;

  await user.save();

  res.status(StatusCodes.OK).json(
    responseObject(`User with the ID : [${id}] Role Edited Successfully...`, {
      user,
      permission: req.permission,
    }),
  );
};

/**
 *
 * EDIT a user
 *
 * @param req: Request
 * @param res: Response
 * @route put /api/v1/users/:id
 * @access Authenticated - PERMISSION : EDIT_USER_ROLE
 */
export const editUserOWNER = async (req: Request, res: Response) => {
  console.log("editUserOWNER");
  const { id } = req.params;
  const { roleId } = req.body;

  const user = await User.findById(id).select("-password");

  if (!user) {
    throw new CustomError.NotFoundError(`No user found with the id of ${id}`);
  }

  const role = await Role.findById(roleId);

  user.role = role?._id;
  await user.save();

  res.status(StatusCodes.OK).json(
    responseObject(`User with the ID : [${id}] Role Edited Successfully...`, {
      user,
      permission: req.permission,
    }),
  );
};

/**
 *
 * DELETE a user
 *
 * @param req: Request
 * @param res: Response
 * @route DELETE /api/v1/users/:id
 * @access Authenticated - PERMISSION : DELETE_USER
 */
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await User.findById(id).select("-password");

  if (!user) {
    throw new CustomError.NotFoundError(`No user found with the id of ${id}`);
  }

  await user.deleteOne();
  await Project.deleteMany({ user: id });
  await Task.deleteMany({ project: { $in: user.projects } });

  res.status(StatusCodes.OK).json(
    responseObject("User Deleted Successfully...", {
      permission: req.permission,
    }),
  );
};
