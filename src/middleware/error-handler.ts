import { Request, Response, NextFunction } from "express";
import { Error } from "mongoose";
import CustomError from "../utilities/errors/customError";

export const errorHandler = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('ErrorHandler', error.message);


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

  return res.status(error.status || 500).send({ error: { message: req.__(error.message) } });

};
