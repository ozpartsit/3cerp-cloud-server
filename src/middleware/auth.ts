import express from "express";
import jwt from "jsonwebtoken";
import Access from "../models/access.model";
import User from "../models/user.model";
import Email from "../services/email";
import CustomError from "../utilities/errors/customError";
import i18n from "../config/i18n";
import Preference from "../models/preference.model";
interface Response extends express.Response {
  user: string | jwt.JwtPayload;
}

export default class Auth {
  private tokenSecret: string;
  constructor() {
    this.tokenSecret = process.env.TOKEN_SECRET || "";
  }
  //Weryfikuje czy token istnieje i jest aktywny 
  public authenticate(
    req: express.Request,
    res: Response,
    next: express.NextFunction
  ) {
    try {
      const tokenParts = (req.headers.authorization || "").split(" ");
      const token = tokenParts[1];

      if (token) {
        jwt.verify(token, this.tokenSecret, (err, value) => {
          if (err) {
            // token wygasł lub jest niepoprawny
            throw new CustomError("auth.failed_auth_token", 500);
          } else {
            if (value) {
              req.headers.user = value.user;
              req.headers.role = value.role;
              req.headers.account = value.account;
              // aktualizacja daty ostatniego authenticate
              User.findByIdAndUpdate(value.user, { $set: { lastAuthDate: new Date() } }).exec();
            }

            next();
          }
        });

      } else {
        // Brak tokena
        throw new CustomError("auth.no_token", 401);
      }
    } catch (error) {
      return next(error);
    }
  }

  // weryfikuje uprawnienia do danego zasobu
  public authorization(collection?: string, recordtype?: string, id?: string, mode?: string) {
    return (
      req: express.Request,
      res: Response,
      next: express.NextFunction
    ) => {
      try {
        let access = true;
        //to do - dodać weryfikacje 

        const check = (collection, recordtype, id, mode) => {
          if (mode == "all") return false;
          else return true;
        }

        if (req.method == "POST") {
          let { collection, recordtype, id, mode } = req.body;
          access = check(collection, recordtype, id, mode);
        } else {
          let { collection, recordtype, id, mode } = req.params;
          access = check(collection, recordtype, id, mode);
        }


        if (access) {
          next();
        } else
          throw new CustomError("auth.access_denied", 401);
      } catch (error) {
        return next(error);
      }
    }
  }

  // potwierdzenie przyznania dostępu
  public accessGranted(
    req: express.Request,
    res: Response,
    next: express.NextFunction
  ) {
    res.status(200).json({ success: { code: "auth.access_granted", message: req.__("auth.access_granted") } });
  }

  // metoda logowania użytkownika
  // na podstawie pary email + hasło nadaje token
  // opcjonalnie rola
  public login(
    req: express.Request,
    res: Response,
    next: express.NextFunction
  ) {
    Access.findOne({ email: req.body.email }).then(async (access) => {
      try {
        if (access) {
          const valide = await access.validatePassword(req.body.password);
          if (valide) {
            User.findOne({ _id: access.user }).then(async (user) => {
              if (user) {
                if (!(user.roles || []).includes(req.body.role || user.role)) {
                  // użytkownik nie ma uprawnień do tej roli
                  throw new CustomError("auth.wrong_role", 403);
                }
                // aktualizacja daty ostatniego logowania
                User.findByIdAndUpdate(user._id, { $set: { lastLoginDate: new Date(), lastAuthDate: new Date() } }).exec()

                const tokens = createTokenPair(access.account.toString(), user._id.toString(), req.body.role || user.role, this.tokenSecret);
                // zwraca parę tokenów
                res.status(200).json(tokens);
              } else {
                // Użytkownik nie istnieje
                throw new CustomError("auth.user_not_found", 404);
              }

            })

          } else {
            // hasło nie pasuje do emaila
            throw new CustomError("auth.wrong_password", 403);
          }
        } else {
          // nie istnieje dostęp dla użytkownika o podanym emailu
          throw new CustomError("auth.user_not_exist", 404);

        }
      } catch (error) {
        return next(error);
      }
    });
  }

  // zwraca nową parę tkenów na postawie refreshToken
  public refreshToken(
    req: express.Request,
    res: Response,
    next: express.NextFunction
  ) {
    try {
      if (req.body.refreshToken) {

        jwt.verify(req.body.refreshToken, this.tokenSecret, (err, value) => {
          if (err) {
            // refreshToken wygasł lub jest błędny
            throw new CustomError("auth.failed_auth_token", 500);
          } else {
            const tokens = createTokenPair(value.account, value.user, value.role, this.tokenSecret);
            res.status(200).json(tokens);
          }
        });


      } else {
        // brak tokena w body
        throw new CustomError("auth.no_token", 401);
      }
    } catch (error) {
      return next(error);
    }
  }

  // zwraca dane zalogowanego użytkownika
  public getUser(
    req: express.Request,
    res: Response,
    next: express.NextFunction
  ) {
    try {
      const tokenParts = (req.headers.authorization || "").split(" ");
      const token = tokenParts[1];
      if (token) {
        jwt.verify(token, this.tokenSecret, (err, value) => {
          if (err) {
            // token nieważny lub nieprawidłowy
            throw new CustomError("auth.failed_auth_token", 500);
          } else {
            if (value && value.user) {
              User.findOne({ _id: value.user }).then(async (user) => {
                if (user) {
                  await user.populate("avatar", "name path")
                  let userLoged = {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    initials: user.initials,
                    jobTitle: user.jobTitle,
                    department: user.department,
                    company: "3C ERP Sp. z o. o.",
                    lastLoginDate: user.lastLoginDate,
                    lastAuthDate: user.lastAuthDate,
                    avatar: user.avatar,
                    resource: user.resource,
                    type: user.type,
                    // role: { _id: "admin", name: "Admin" },
                    // roles: [{ _id: "admin", name: "Admin" }, { _id: "accounts", name: "Accounts" }],
                  };
                  // to do - generować na podstawie roli
                  const permissions = {
                    transactions: {
                      salesorder: ["view", "add", "edit", "all"],
                      itemfulfillment: ["view", "add", "edit", "all"],
                      invoice: ["view", "add", "edit"],
                    },
                    items: {
                      invitem: ["view", "add", "edit"],
                      kititem: ["view", "add", "edit"],
                      service: ["view", "edit"],
                    },
                    entities: {
                      customer: ["view", "add", "edit"],
                      vendor: ["view", "add", "edit"]
                    }
                  }
                  const preferences = await Preference.findById(value.user);
                  res.status(200).json({ user: userLoged, permissions, preferences, token: token, role: value.role, account: "3cerpcloud" });
                } else {
                  // user nie istnieje
                  throw new CustomError("auth.user_not_found", 404);
                }
              })
            }
          }
        });
      } else {
        // brak Tokena
        throw new CustomError("auth.no_token", 401);
      }
    } catch (error) {
      return next(error);
    }
  }

  public async resetPassword(
    req: express.Request,
    res: Response,
    next: express.NextFunction
  ) {

    try {
      await Access.findOne({ email: req.body.email }).then(async (access) => {
        if (access) {
          // const resetToken = jwt.sign({ _id: access._id }, this.tokenSecret, {
          //   expiresIn: "1h"
          // });

          // let template = await Email.resetPassword(req.body.email, resetToken, req.locale);
          // await Email.send(template);

          await access.resetPassword(req.locale);
          res.status(200).json({ status: "success", data: { message: req.__("auth.reset_password") } });
        } else {
          // access nie istnieje
          throw new CustomError("auth.user_not_found", 404);
        }
      })
    } catch (error) {
      return next(error);
    }
  }

  public async setPassword(
    req: express.Request,
    res: Response,
    next: express.NextFunction
  ) {
    i18n.setLocale(req.locale || "en");
    try {
      await jwt.verify(req.body.resetToken, this.tokenSecret, async (err, value) => {
        if (err) {
          // resetToken wygasł lub jest błędny
          throw new CustomError("auth.failed_auth_token", 500);
        } else {
          await Access.findOne({ _id: value._id }).then(async (access) => {
            if (access) {
              access.password = req.body.password;
              await access.save();
              res.status(200).json({ status: "success", data: { message: req.__("auth.password_updated") } });
            } else {
              // access nie istnieje
              throw new CustomError("auth.user_not_found", 404);
            }
          })
        }
      })
    } catch (error) {
      return next(error);
    }
  }


  public async contactForm(
    req: express.Request,
    res: Response,
    next: express.NextFunction
  ) {
    try {

      if (!req.body.email) {
        // email jest wymagany
        throw new CustomError("auth.email_required", 404);
      }
      let template = await Email.signUp(req.body.email, req.locale)
      await Email.send(template);
      // to do - dopisać tworzenie leada
      res.status(200).json({ status: "success", data: { message: req.__("auth.contact_form") } });

    } catch (error) {
      return next(error);
    }
  }
}

function createTokenPair(account: string, user: string, role: string, tokenSecret: string) {
  const token = jwt.sign({ account: account, user: user, role: role }, tokenSecret, {
    expiresIn: "1h"
  });
  const refreshToken = jwt.sign({ account: account, user: user, role: role }, tokenSecret, {
    expiresIn: "12h"
  });
  const expires = Math.floor(addHours(new Date(), 1).getTime() / 1000);
  return { status: "success", type: "Bearer", token, expires, refreshToken }
}

function addHours(date: Date, hours: number) {
  date.setTime(date.getTime() + hours * 60 * 60 * 1000);
  return date;
}