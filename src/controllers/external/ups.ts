import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import qs from 'qs';
import CustomError from "../../utilities/errors/customError";

//UPS 138R32
const clients = {
    "138R32": {
        client_id: "TA3eKFeFgGM1uNFDjYsvELpBVApjHrGjdU96SkcCcQ2b1y5e",
        client_secret: "E2HaUFhIZnp6pS3UcsC8XWyLBAK0Gw86J3GPcQD2CJ71bonE64DM59E1Qvs3VmAX"
    },
    "G2233R": {
        client_id: "ksPE35oYgmKLvEC6A3WwpBCeb3Y8v9GqDiVvoeCW8TVInkmC",
        client_secret: "R1PEssZaA3e6GybvASA8HsCTnIyWsnLzdrJGJB7cBv8UeQn1SMnsRFpGuKilVFGK"
    }
}



export default class controller {
    //public token: string;
    public tokens: any;
    //public expires: Date;
    constructor() {
        //this.token = "";
        this.tokens = {};
        //this.expires = new Date();
        this.login("138R32");
        this.login("G2233R");
    }


    public async login(account: string = "138R32") {
        try {
            const data = qs.stringify({
                grant_type: "client_credentials"
            });
            const authorization = Buffer.from(`${clients[account].client_id}:${clients[account].client_secret}`, 'utf8').toString('base64');

            let token = await axios.post('https://onlinetools.ups.com/security/v1/oauth/token',
                data,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': `Basic ${authorization}`
                    }
                })
                .then(function (response) {
                    return response.data["access_token"];
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
    public async getToken(req: Request, res: Response, next: NextFunction) {
        try {
            let token = "";
            let expires = null;
            if (!req.params.account) req.params.account = "138R32";

            if (req.params.account) {
                if (this.tokens[req.params.account]) {

                    token = this.tokens[req.params.account].token;
                    expires = this.tokens[req.params.account].expires;

                }

                if (!token || !expires || (expires && new Date().getTime() > new Date(expires).getTime())) {

                    await this.login(req.params.account);
                    if (this.tokens[req.params.account])
                        token = this.tokens[req.params.account].token;
                }
            }

            res.json({ status: "success", data: { token: token } });
        } catch (error) {
            console.log(error)
        }

    }

}
