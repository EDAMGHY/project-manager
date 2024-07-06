export const responseObject = (msg: string, status = true, ...rest) => ({
  success: status,
  msg,
  ...rest,
});
