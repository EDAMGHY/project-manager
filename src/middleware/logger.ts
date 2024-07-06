import { Request, Response, NextFunction } from "express";
import { Logger } from "@/models"; // Adjust the import path as necessary

export function logRequest(
  req: Request & { user?: { _id: string; role: string } },
  res: Response,
  next: NextFunction,
) {
  const start = process.hrtime();

  res.on("finish", async () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const responseTime = seconds * 1000 + nanoseconds / 1e6; // Convert to milliseconds

    const logEntry = new Logger({
      action: "Request", // Customize this as needed
      description: `${req.method} ${req.path}`, // Example description
      user: req?.user?._id, // Assuming you have user information in request
      role: req?.user?.role, // Assuming you have user information in request
      ipAddress: req.ip,
      method: req.method,
      endpoint: req.originalUrl,
      statusCode: res.statusCode,
      responseTime,
      userAgent: req.get("User-Agent"),
      // Add other fields as necessary
    });

    try {
      await logEntry.save();
    } catch (error) {
      console.error("Error saving log:", error);
    }
  });

  next();
}
