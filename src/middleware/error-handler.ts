import { Request, Response, NextFunction } from "express";
//import { CustomError } from "../errors/custom-errors";
interface ResponseError extends Error {
  status?: number;
}
export const errorHandler = (
  error: ResponseError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //if (err instanceof CustomError) res.status(err.statusCode).send({ errors: err.serializeErrors() });
  // if (error instanceof ValidationError) {
  //   let errors = {};

  //   Object.keys(error.errors).forEach((key) => {
  //     errors[key] = error.errors[key].message;
  //   });

  //   return res.status(400).send(errors);
  // }

  console.log("error handler", error.name, error.message);
  res.status(error.status || 500).send({
    message: error.message
  });
};
