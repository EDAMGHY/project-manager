import { responseObject } from "@/lib";
import * as CustomError from "@/errors";
import { Response } from "express";
import { IFilterExpress, Request } from "@/types";
import { User } from "@/models";
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
  const { role, name, email, username, sort } = req.query;
  // Filter setup
  const filters: IFilterExpress[] = [];

  // Add other filters as needed
  if (name) filters.push({ name: { $regex: `.*${name}.*`, $options: "i" } });
  if (username)
    filters.push({ username: { $regex: `.*${username}.*`, $options: "i" } });
  if (email) filters.push({ email: { $regex: `.*${email}.*`, $options: "i" } });
  if (role) filters.push({ role: role as string });

  // Sorting setup
  let sorting: string = "createdAt";
  if (sort) sorting = sort.toString();

  const users = await User.find({ $and: filters })
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
  res.json(
    responseObject("Current User Fetched Successfully...", {
      user,
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

  res.status(StatusCodes.OK).json(
    responseObject("User Deleted Successfully...", {
      permission: req.permission,
    }),
  );
};
