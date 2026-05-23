import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";

import apiRouter from "./routes/index.js";
import { corsMiddleware } from "./middlewares/cors.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();

app.use(logger("dev"));
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api", apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
