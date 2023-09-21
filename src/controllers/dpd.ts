import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import CustomError from "../utilities/errors/customError";

export default class controller {
    public token: string;
    public expires: Date;
    constructor() {
        this.token = "";
        this.expires = new Date();
        this.login();

    }
    public async login() {
        this.token = await axios.post('https://api-preprod.dpsin.dpdgroup.com:8443/shipping/v1/login', {}, {
            headers: {
                "X-DPD-LOGIN": "test",
                "X-DPD-PASSWORD": "thetu4Ee",
                "X-DPD-BUCODE": "021"
            }
        })
            .then(function (response) {
                return response.headers["x-dpd-token"];
            })
            .catch(function (error) {
                throw error
            });

        // Pobierz aktualną datę i czas
        let now = new Date();
        // Dodaj jedną godzinę do aktualnej daty i czasu
        now.setHours(now.getHours() + 11);
        this.expires = now;
    }
    public async shipment(req: Request, res: Response, next: NextFunction) {
        // odswieżenie tokena
        if (new Date() > this.expires) await this.login();
        try {
            let queries = formatQueryParams(req.query);
            await axios.post(`https://api-preprod.dpsin.dpdgroup.com:8443/shipping/v1/shipment?${queries}`, req.body, {
                headers: {
                    Authorization: `Bearer ${this.token}`,
                    "Content-Type": "application/json"
                }
            })
                .then(function (response) {
                    res.json({ status: "success", data: response.data });
                })
                .catch(function (error) {
                    throw new CustomError(error.response.data.errorCode, 404);

                });
        } catch (error) {
            return next(error);
        }
    }
}
// parsowanie Queries na url component
function formatQueryParams(queryObj: any) {
    const queryParams: string[] = [];
    for (const [key, value] of Object.entries<any>(queryObj)) {
        const field = encodeURIComponent(key);
        const val = encodeURIComponent(value)
        queryParams.push(`${field}=${val}`);
    }
    return queryParams.join('&');
}