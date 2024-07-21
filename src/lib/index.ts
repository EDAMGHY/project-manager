import { METHOD } from "@/types";

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
