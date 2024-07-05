import { cleanEnv, str, port } from "envalid";

export const env = cleanEnv(process.env, {
  PORT: port(),
  MONGO_URI: str({ default: "MONGO_URI" }),
  NODE_ENV: str({
    choices: ["development", "test", "production", "staging"],
    default: "development",
  }),
});
