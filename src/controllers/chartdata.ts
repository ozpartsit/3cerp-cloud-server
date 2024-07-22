import controller from "./genericController";
import { Request, Response, NextFunction } from "express";
import { IExtendedModel } from "../utilities/static";
import { IExtendedDocument } from "../utilities/methods";
import Chart from "../models/chartPreference.model";
import CustomError from "../utilities/errors/customError";
// Typ generyczny dla modelu Mongoose
interface IModel<T extends IExtendedDocument> extends IExtendedModel<T> { }
export default class chartDataController {

  public async getData(req: Request, res: Response, next: NextFunction) {
    try {
      let { recordtype, id } = req.params;
      let { field } = req.query;
      let document = await Chart.getDocument(id, 'simple', false, (field || "_id").toString());
      if (document) {

        let results: any = [];

        let yearly = ["2021", "2022", "2023", "2024"];
        let quarterly = ["Q1", "Q2", "Q3", "Q4"];
        let mounthly = ["M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8", "M9", "M10", "M11", "M12"];

        let countries = ["PL", "GB", "DE", "ES", "FR", "IT", "SI", "GR"]
        if (document.field == "date") {
          let label = "";
          for (let y of yearly) {
            label = y;
            if (document.intervals) {
              for (let i of quarterly) {
                label = y + i;
                let data = {
                  field: label,
                  value: Math.floor(Math.random() * (50 - 10) + 10)
                }

                results.push(data)
              }
            } else {
              let data = {
                field: label,
                value: Math.floor(Math.random() * (50 - 10) + 10)
              }
              results.push(data)
            }
          }
        } else {
          let label = "";
          for (let c of countries) {
            label = c;
            let data = {
              field: label,
              value: Math.floor(Math.random() * (50 - 10) + 10)
            }

            results.push(data)
          }
        }


  
        res.send({ status: "success", data: results })
      } else {
        throw new CustomError("doc_not_found", 404);
      }
    } catch (error) {
      return next(error);
    }
  }
}
