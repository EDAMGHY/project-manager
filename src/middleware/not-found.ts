import { responseObject } from "@/lib";
import { Response, Request } from "express";
import { StatusCodes } from "http-status-codes";

export const notFoundMiddleware = (req: Request, res: Response) =>
  res
    .status(StatusCodes.NOT_FOUND)
    .json(responseObject("Resource does not exist", null, false));
