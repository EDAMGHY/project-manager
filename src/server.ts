import express, { Request, Response, Application } from "express";
import morgan from "morgan";
import "dotenv/config";
import { connectDB } from "@/config";
import { env } from "@/lib";

const app: Application = express();
const PORT = env.PORT || 8000;

connectDB();

app.use(morgan("tiny"));

app.get("/", (req: Request, res: Response) => {
  res.json({
    msg: "API Running...",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
