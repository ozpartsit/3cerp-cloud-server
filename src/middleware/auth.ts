import express from "express";
import jwt from "jsonwebtoken";
import Access from "../models/access.model";
import User from "../models/user.model";
import Email from "../services/email";
import CustomError from "../utilities/errors/customError";
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
    const tokenParts = (req.headers.authorization || "").split(" ");
    const token = tokenParts[1];
    if (token) {
      try {
        jwt.verify(token, this.tokenSecret, (err, value) => {
          if (err) {
            // token wygasł lub jest niepoprawny
            throw new CustomError("auth.failed_auth_token", 500);
          } else {
            if (value) {
              req.headers.user = value.user;
              req.headers.role = value.role;
              // aktualizacja daty ostatniego authenticate
              User.findByIdAndUpdate(value.user, { $set: { lastAuthDate: new Date() } }).exec();
            }
            next();
          }
        });
      } catch (error) {
        throw error;
      }
    } else {
      // Brak tokena
      throw new CustomError("auth.no_token", 401);
    }
  }

  // weryfikuje uprawnienia do danego zasobu
  public authorization(level: any) {
    return (
      req: express.Request,
      res: Response,
      next: express.NextFunction
    ) => {
      //to do - dodać weryfikacje 
      if (level < 2 || true)
        next();
      else
        throw new CustomError("auth.access_denied", 401);
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

              const tokens = createTokenPair(user._id.toString(), req.body.role || user.role, this.tokenSecret);
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
    });
  }

  // zwraca nową parę tkenów na postawie refreshToken
  public refreshToken(
    req: express.Request,
    res: Response,
    next: express.NextFunction
  ) {
    if (req.body.refreshToken) {
      try {
        jwt.verify(req.body.refreshToken, this.tokenSecret, (err, value) => {
          if (err) {
            // refreshToken wygasł lub jest błędny
            throw new CustomError("auth.failed_auth_token", 500);
          } else {
            const tokens = createTokenPair(value.user, value.role, this.tokenSecret);
            res.status(200).json(tokens);
          }
        });
      } catch (err) {
        // refreshToken wygasł lub jest błędny
        throw new CustomError("auth.invalid_token", 400);
      }

    } else {
      // brak tokena w body
      throw new CustomError("auth.no_token", 401);
    }
  }

  // zwraca dane zalogowanego użytkownika
  public getUser(
    req: express.Request,
    res: Response,
    next: express.NextFunction
  ) {
    const tokenParts = (req.headers.authorization || "").split(" ");
    const token = tokenParts[1];
    if (token) {
      try {
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
                    locale: user.locale,
                    avatar: user.avatar,
                    resource: user.resource,
                    type: user.type
                    // role: { _id: "admin", name: "Admin" },
                    // roles: [{ _id: "admin", name: "Admin" }, { _id: "accounts", name: "Accounts" }],
                  };

                  res.status(200).json({ user: userLoged, token: token, role: value.role, account: "3cerpcloud" });
                } else {
                  // user nie istnieje
                  throw new CustomError("auth.user_not_found", 404);
                }
              })
            }
          }
        });
      } catch (err) {
        // token nieważny lub nieprawidłowy
        throw new CustomError("auth.invalid_token", 400);
      }

    } else {
      // brak Tokena
      throw new CustomError("auth.no_token", 401);
    }
  }

  public resetPassword(
    req: express.Request,
    res: Response,
    next: express.NextFunction
  ) {
    Access.findOne({ email: req.body.email }).then(async (access) => {
      if (access) {
        const resetToken = jwt.sign({ _id: access._id }, this.tokenSecret, {
          expiresIn: "1h"
        });

        let email = new Email();

        let template = {
          from: 'notification@3cerp.cloud',
          to: req.body.email,
          subject: '3C ERP Cloud | Reset Password',
          html: `<a href="https://3cerp.cloud/auth/reset_password?resetToken=${resetToken}">Reset Password</a>`
        }
        await email.send(template);
        res.status(200).json({ status: "success" });
      } else {
        // access nie istnieje
        throw new CustomError("auth.user_not_found", 404);
      }
    })
  }

  public setPassword(
    req: express.Request,
    res: Response,
    next: express.NextFunction
  ) {
    jwt.verify(req.body.resetToken, this.tokenSecret, (err, value) => {
      if (err) {
        // resetToken wygasł lub jest błędny
        throw new CustomError("auth.failed_auth_token", 500);
      } else {
        Access.findOne({ _id: value._id }).then(async (access) => {
          if (access) {
            access.password = req.body.password;
            access.save();
            res.status(200).json({ status: "success" });
          } else {
            // access nie istnieje
            throw new CustomError("auth.user_not_found", 404);
          }
        })
      }
    });

  }
}

function createTokenPair(user: string, role: string, tokenSecret: string) {
  const token = jwt.sign({ user: user, role: role }, tokenSecret, {
    expiresIn: "1h"
  });
  const refreshToken = jwt.sign({ user: user, role: role }, tokenSecret, {
    expiresIn: "12h"
  });
  const expires = Math.floor(addHours(new Date(), 1).getTime() / 1000);
  return { status: "success", type: "Bearer", token, expires, refreshToken }
}

function addHours(date: Date, hours: number) {
  date.setTime(date.getTime() + hours * 60 * 60 * 1000);
  return date;
}