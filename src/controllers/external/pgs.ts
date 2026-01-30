import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import CustomError from "../../utilities/errors/customError";

export default class controller {

    constructor() {


    }

    public async shipment(req: Request, res: Response, next: NextFunction) {
        // odswieżenie tokena
        try {

            await axios.post(`https://api.vigocloud.com/api/v1/consignments?code=QVBJOmNjNTRhM2U2ZjJiMTQzOTFhMzFhODFmOWFjODA1Y2I2Om8rT3FkcHJ6cjBwWjJER2RYRUpabCs0UjArdjU3K2VWSFZUYmFEblczWUU9`, req.body, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(function (response) {
                    res.json(response.data);
                })
                .catch(function (error) {
                    let errorMsg = "Unknown Error";
                    if (!Array.isArray(error.response.data)) errorMsg = error.response.data.errorMessage || error.response.data.errorCode;
                    else errorMsg = error.response.data[0].errorMessage || error.response.data[0].errorCode;
                    if (!errorMsg) errorMsg = JSON.stringify(error.response.data);
                    throw new CustomError(errorMsg, 404);

                });
        } catch (error) {
            return next(error);
        }
    }
    public async label(req: Request, res: Response, next: NextFunction) {
        try {
            let body = req.body;
            console.log(req.params.shipmentId)
            await axios.get(`https://api.vigocloud.com/api/v1/consignments/${req.params.shipmentId}/labels?code=QVBJOmNjNTRhM2U2ZjJiMTQzOTFhMzFhODFmOWFjODA1Y2I2Om8rT3FkcHJ6cjBwWjJER2RYRUpabCs0UjArdjU3K2VWSFZUYmFEblczWUU9`, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(function (response) {
                    res.json(response.data);
                })
                .catch(function (error) {
                    let errorMsg = "Unknown Error";
                    if (!Array.isArray(error.response.data)) errorMsg = error.response.data.errorMessage || error.response.data.errorCode;
                    else errorMsg = error.response.data[0].errorMessage || error.response.data[0].errorCode;
                    if (!errorMsg) errorMsg = JSON.stringify(error.response.data);
                    throw new CustomError(errorMsg, 404);

                });
        } catch (error) {
            return next(error);
        }
    }
}
