import { Express } from "express";
import router from "./routes/router.mjs";

export const init = (app: Express) => {
  app.use(router);
};
