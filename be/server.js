import dotenv from "dotenv";
import express from "express";
import createError from "http-errors";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";

import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";

// Import client từ db.js
import client from "./config/db.js";

const app = express();

// Middleware setup
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Không cần gọi client() nữa vì kết nối đã được thực hiện trong db.js

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.json({ message: err.message, error: err });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
