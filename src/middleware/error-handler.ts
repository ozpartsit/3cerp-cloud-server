import { Request, Response, NextFunction } from "express";
import CustomError from "../utilities/errors/customError";
import i18n from "../config/i18n";
export default function (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  i18n.setLocale(req.locale || "en");
  console.log('ErrorHandler', error.message || error);


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

  return res.status(error.status || 500).send({ status: "error", error: { message: req.__(error.message || error.toString()) } });

};
