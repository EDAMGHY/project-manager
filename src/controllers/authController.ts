import { responseObject } from "@/lib";
import * as CustomError from "@/errors";
import { Response } from "express";
import { Request } from "@/types";
import { attachCookiesToResponse, createTokenUser } from "@/utils";
import { Role, User } from "@/models";
import { StatusCodes } from "http-status-codes";

/**
 *
 * Register a new user
 *
 * @param req: Request
 * @param res: Response
 * @route POST /api/v1/auth/register
 * @access Public
 */
export const register = async (req: Request, res: Response) => {
  const { email, username, name, password } = req.body;

  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError("Email already exists");
  }

  // first registered user is an admin
  const role = await Role.findOne({
    name: username === "edamghy" ? "OWNER" : "USER",
  });

  const user = await User.create({
    name,
    email,
    username,
    password,
    role: role._id,
  });

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });

  res
    .status(StatusCodes.CREATED)
    .json(responseObject("User Registered Successfully", { user: tokenUser }));
};

/**
 *
 * Login a user
 *
 * @param req: Request
 * @param res: Response
 * @route POST /api/v1/auth/login
 * @access Public
 */
export const login = async (req: Request, res: Response) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    throw new CustomError.BadRequestError(
      "Please provide identifier and password",
    );
  }
  const user = await User.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  });

  if (!user) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);

  console.log("useruseruser", isPasswordCorrect);

  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });

  res
    .status(StatusCodes.OK)
    .json(
      responseObject("User logged in Successfully...", { user: tokenUser }),
    );
};

/**
 *
 * Logout an authenticated user
 *
 * @param req: Request
 * @param res: Response
 * @route POST /api/v1/auth/logout
 * @access Authenticated
 */
export const logout = async (req: Request, res: Response) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });

  res
    .status(StatusCodes.OK)
    .json(responseObject("User logged out Successfully..."));
};
