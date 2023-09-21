import Account from "../models/account.model";
import controller from "./genericController";
import { Request, Response, NextFunction } from "express";
import { Document, Model } from 'mongoose';
import { IExtendedModel } from "../utilities/static";
import { IExtendedDocument } from "../utilities/methods";
import { execSync, exec } from "child_process";
import path from "path";
import fs from "fs";


// Typ generyczny dla modelu Mongoose
interface IModel<T extends IExtendedDocument> extends IExtendedModel<T> { }

export default class AccountController<T extends IExtendedDocument> extends controller<T> {
    constructor(model: IModel<T>) {
        super(model);
    }
    public async add(req: Request, res: Response, next: NextFunction) {
        await super.add(req, res, next);
        this.syncDB();
    }
    public async syncDB() {
        let accounts = await Account.find();
        for (let account of accounts) {



            // Uruchamiamy proces
            const child: any = exec(`devil mongo db add ${account._id}`);

            // Dostarczamy hasło do procesu jako dane wejściowe
            child.stdin.write("\n");

            // potwierdź hasło do procesu jako dane wejściowe
            child.stdin.write("\n");
            child.stdin.end();

            // Obsługujemy wyniki działania procesu
            child.stdout.on('data', (data) => {
                //console.log('Standard Output:', data.toString());
                const regex = /(?<=:\s)(.*?)(?=\n)/gm;
                let match;
                let matches: any = [];
                let text = data.toString()
                while ((match = regex.exec(text)) !== null) {
                    matches.push(match[0])
                }
                account.dbName = matches[0];
                account.dbHost = matches[1];
                account.dbPass = matches[2];
                account.save();
            });

            child.stderr.on('data', (data) => {
                console.error('Standard Error:', data.toString());
            });

            child.on('close', (code) => {
                console.log('Proces zakończony z kodem:', code);
            });

        }
    }
}
