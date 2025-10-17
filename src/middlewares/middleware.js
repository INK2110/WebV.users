import morgan from "morgan";
import {logger} from "./logger.js";
import {requireAuth , authGuard , sessionMiddleware , attachUser, requireRole} from "./auth.js";


export const initMiddleware = (app) => {
  app.use(morgan("dev"));
  app.use(logger);
  app.use(sessionMiddleware);
  app.use(authGuard);
  app.use(attachUser);
};
