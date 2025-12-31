import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import CustomError from "../../utilities/errors/customError";

const clients = {
    "monkfishautomotive": {
        client_id: "monkfishautomotive",
        client_secret: "leylanddaf45#"
    },
}

export default class controller {
    public tokens: any;
    public expires: Date;

    constructor() {
        this.tokens = {};
        this.expires = new Date();
        this.login();

    }
    public async login(account: string = "monkfishautomotive") {
        try {
            const authorization = Buffer.from(`${clients[account].client_id}:${clients[account].client_secret}`, 'utf8').toString('base64');
            let token = await axios.post('https://api.dpd.co.uk/user/?action=login', {}, {
                headers: {
                    Authorization: `Basic ${authorization}`
                }
            })
                .then(function (response) {
                    return response.data.data["geoSession"];
                })
                .catch(function (error) {
                    throw error
                });

            // Pobierz aktualną datę i czas
            let now = new Date();
            // Dodaj jedną godzinę do aktualnej daty i czasu
            now.setHours(now.getHours() + 4);

            this.tokens[account] = {
                token: token,
                expires: now
            }
        } catch (error) {
            console.log(error)
        }

    }
    public async shipment(req: Request, res: Response, next: NextFunction) {
        // odswieżenie tokena
        try {
            const authorization = Buffer.from(`${clients[req.get("User") || ""].client_id}:${clients[req.get("User") || ""].client_secret}`, 'utf8').toString('base64');
            if (!this.tokens[req.get("User") || ""].token || (new Date() > this.tokens[req.get("User") || ""].expires)) await this.login(req.get("User") || "");
            let queries = formatQueryParams(req.query);

            await axios.post(`https://api.dpd.co.uk/shipping/shipment?${queries}`, req.body, {
                headers: {
                    GEOSession: this.tokens[req.get("User") || ""].token,
                    Authorization: `Basic ${authorization}`
                }
            })
                .then(function (response) {
                    res.json({ status: "success", data: response.data });
                })
                .catch(function (error) {
                    let errorMsg = "Unknown Error";
                    if (!Array.isArray(error.response.data)) errorMsg = error.response.data.error || error.response.data.error;
                    else errorMsg = error.response.data[0].error || error.response.data[0].error;
                    if (!errorMsg) errorMsg = JSON.stringify(error.response.data);
                    throw new CustomError(errorMsg, 404);

                });
        } catch (error) {
            return next(error);
        }
    }
    public async label(req: Request, res: Response, next: NextFunction) {
        // odswieżenie tokena
        try {
            if (!req.get("User")) throw new CustomError("Unrecognized DPD Account", 500);
            // console.log(req.get("User"))
            const authorization = Buffer.from(`${clients[req.get("User") || ""].client_id}:${clients[req.get("User") || ""].client_secret}`, 'utf8').toString('base64');
            if (!this.tokens[req.get("User") || ""] || new Date() > this.tokens[req.get("User") || ""].expires) await this.login(req.get("User") || "");
            await axios.get(`https://api.dpd.co.uk/shipping/shipment/${req.params.shipmentId}/label`, {
                headers: {
                    GEOSession: this.tokens[req.get("User") || ""].token,
                    Authorization: `Basic ${authorization}`
                }
            })
                .then(function (response) {
                    res.json({ status: "success", data: response.data });
                })
                .catch(function (error) {
                    let errorMsg = "Unknown Error";
                    if (!Array.isArray(error.response.data)) errorMsg = error.response.data.error || error.response.data.error;
                    else errorMsg = error.response.data[0].error || error.response.data[0].error;
                    if (!errorMsg) errorMsg = JSON.stringify(error.response.data);
                    throw new CustomError(errorMsg, 404);

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