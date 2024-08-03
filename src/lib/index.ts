import { METHOD } from "@/types";

// Enums
export const statsEnum = ["planning", "active", "completed"];
export const taskStatsEnum = ["started", "pending", "in progress", "completed"];
export const prioritiesEnum = ["low", "medium", "high"];

// Functions
export const responseObject = (
  message: string,
  // eslint-disable-next-line
  data: any = null,
  status = true,
  ...rest
) => ({
  success: status,
  message,
  data,
  ...rest,
});

export const methodMap = {
  GET: "GET",
  POST: "CREATE",
  PUT: "EDIT",
  PATCH: "EDIT",
  DELETE: "DELETE",
};

export const getPermission = (url: string, method: METHOD = "GET") => {
  const splittedUrl = url?.split("/")?.filter((item: string) => item);
  const str = splittedUrl?.[2]?.toUpperCase();
  let model = str?.slice(0, -1);

  if (splittedUrl.length === 3 && method === "GET") {
    model = str;
  }

  const action = methodMap[method];
  const permission = `${action}_${model}`;

  return permission;
};

/**
 *
 * @param page number
 * @param perPage number
 * @param length  number
 * @returns limit, skip, total
 */
export const getPagination = (
  page: number,
  perPage: number,
  length: number,
): { limit: number; skip: number; total: number } => {
  const limit = +perPage;
  const skip = +perPage * (+page - 1);
  const totalPages = Math.ceil(length / limit) || 0;

  return { limit, skip, total: totalPages };
};

export const getRoleName = (username: string) => {
  let role = "USER";
  switch (username) {
    case "edamghy":
      role = "OWNER";
      break;
    case "erenyeager":
      role = "ADMIN";
      break;
    default:
      role = "USER";
      break;
  }

  return role;
};
