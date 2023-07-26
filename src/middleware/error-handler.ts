import { Request, Response, NextFunction } from "express";
import { Error } from "mongoose";
//import { CustomError } from "../errors/custom-errors";
interface ResponseError extends Error {
  status?: number;
  errors?: any;
}
export const errorHandler = (
  error: ResponseError[] | ResponseError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('ErrorHandler', error);
  //let errors: ResponseError[] = [];
  let status = 500;
  // let message = "Error";
  // if (!Array.isArray(error)) {
  //   status = error.status || 500;
  //   message = error.message;
  //   errors = [error];
  // }
  // else errors = error;
  //errors.forEach((error: ResponseError) => {
  //if (err instanceof CustomError) res.status(err.statusCode).send({ errors: err.serializeErrors() });
  // if (error instanceof Error.ValidatorError || Error.ValidationError) {

  //   let errors = {};
  //   if (error.errors) {
  //     Object.keys(error.errors).forEach((key) => {
  //       errors[key] = {
  //         list: error.errors[key].list,
  //         _id: error.errors[key]._id,
  //         kind: error.errors[key].kind,
  //         message: error.errors[key].message
  //       };
  //     });

  //   }
  // }
  //})

  return res.status(status).send({ error: error });

};
