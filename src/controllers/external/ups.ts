import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import CustomError from "../../utilities/errors/customError";
const client_id = "TA3eKFeFgGM1uNFDjYsvELpBVApjHrGjdU96SkcCcQ2b1y5e";
const client_secret = "E2HaUFhIZnp6pS3UcsC8XWyLBAK0Gw86J3GPcQD2CJ71bonE64DM59E1Qvs3VmAX";
const authorization = Buffer.from(`${client_id}:${client_secret}`, 'utf8').toString('base64');

export default class controller {
    public token: string;
    public expires: Date;
    constructor() {
        this.token = "";
        this.expires = new Date();
        this.login();

    }


    public async login() {
        try {
            this.token = await axios.post('https://onlinetools.ups.com/security/v1/oauth/token',
                {
                    "grant_type": "client_credentials"
                },
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': `Basic ${authorization}`
                    }
                })
                .then(function (response) {
                    console.log(response)
                    return response.headers["access_token"];
                })
                .catch(function (error) {
                    console.log(error)
                    //throw error
                });

            // Pobierz aktualną datę i czas
            let now = new Date();
            // Dodaj jedną godzinę do aktualnej daty i czasu
            now.setHours(now.getHours() + 4);
            this.expires = now;
        } catch (error) {
             console.log(error)
        }
    }
    public async getToken(req: Request, res: Response, next: NextFunction) {
        if (!this.token || new Date() > this.expires) await this.login();
        res.json({ status: "success", data: { token: this.token } });
    }

    // public async shipment(req: Request, res: Response, next: NextFunction) {
    //     // odswieżenie tokena
    //     try {
    //         if (new Date() > this.expires) await this.login();
    //         let queries = formatQueryParams(req.query);
    //         await axios.post(`https://api.dpdgroup.com/shipping/v1/shipment?${queries}`, req.body, {
    //             headers: {
    //                 Authorization: `Bearer ${this.token}`,
    //                 "Content-Type": "application/json"
    //             }
    //         })
    //             .then(function (response) {
    //                 res.json({ status: "success", data: response.data });
    //             })
    //             .catch(function (error) {
    //                 let errorMsg = "Unknown Error";
    //                 if (!Array.isArray(error.response.data)) errorMsg = error.response.data.errorMessage || error.response.data.errorCode;
    //                 else errorMsg = error.response.data[0].errorMessage || error.response.data[0].errorCode;
    //                 if (!errorMsg) errorMsg = JSON.stringify(error.response.data);
    //                 throw new CustomError(errorMsg, 404);

    //             });
    //     } catch (error) {
    //         return next(error);
    //     }
    // }
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