import express from "express";
import jwt from "jsonwebtoken";
import Entity from "../models/entities/model";
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
            res.status(500).json({ message: req.__('auth.failed_auth_token') });
          } else {
            if (value) {
              req.headers.user = value.user;
              req.headers.role = value.role;
            }
            next();
          }
        });
      } catch (err) {
        // token wygasł lub jest niepoprawny
        res.status(400).json({ message: req.__('auth.invalid_token') });
      }

    } else {
      // Brak tokena
      res.status(401).json({ message: req.__("auth.no_token") });
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
        res.status(500).json({ message: req.__('auth.access_denied') });
    }
  }

  // potwierdzenie przyznania dostępu
  public accessGranted(
    req: express.Request,
    res: Response,
    next: express.NextFunction
  ) {
    res.status(200).json({ message: req.__("auth.access_granted") });
  }

  // metoda logowania użytkownika
  // na podstawie pary email + hasło nadaje token
  // opcjonalnie rola
  public login(
    req: express.Request,
    res: Response,
    next: express.NextFunction
  ) {
    Entity.findOne({ email: req.body.email }).then(async (user) => {
      if (user) {
        const valide = await user.validatePassword(req.body.password);
        if (valide) {
          if (!(user.roles || []).includes(req.body.role || user.role)) {
            // użytkownik nie ma uprawnień do tej roli
            res.status(403).json({ message: req.__("auth.wrong_role") });
          }

          const tokens = createTokenPair(user._id, req.body.role || user.role, this.tokenSecret);
          // zwraca parę tokenów
          res.status(200).json(tokens);
        } else {
          // hasło nie pasuje do emaila
          res.status(403).json({ message: req.__("auth.wrong_password") });
        }
      } else {
        // nie istnieje dostęp dla użytkownika o podanym emailu
        res.status(404).json({ message: req.__("auth.user_not_exist") });
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
            res.status(500).json({ message: req.__('auth.failed_auth_token') });
          } else {
            const tokens = createTokenPair(value.user, value.role, this.tokenSecret);
            res.status(200).json(tokens);
          }
        });
      } catch (err) {
        // refreshToken wygasł lub jest błędny
        res.status(400).json({ message: req.__('auth.invalid_token') });
      }

    } else {
      // brak tokena w body
      res.status(401).json({ message: req.__("auth.no_token") });
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
            res.status(500).json({ message: req.__('auth.failed_auth_token') });
          } else {
            if (value && value.user) {
              Entity.findOne({ _id: value.user }).then(async (user) => {
                if (user) {
                  let userLoged = {
                    _id: user._id,
                    account: "3cerpcloud",
                    name: user.name,
                    email: user.email,
                    firstName: "Łukasz",
                    lastName: "Śpiewak",
                    initials: "ŁŚ",
                    jobTitle: "Administrator",
                    department: "IT",
                    company: "3C ERP Sp. z o. o.",
                    lastLoginDate: new Date('2023-07-26'),
                    lastAuthDate: new Date('2023-07-26'),
                    locale: user.locale,
                    role: { _id: "admin", name: "Admin" },
                    roles: [{ _id: "admin", name: "Admin" }, { _id: "accounts", name: "Accounts" }],
                  };

                  res.status(200).json({ user: userLoged });
                }
              })
            }
          }
        });
      } catch (err) {
        // token nieważny lub nieprawidłowy
        res.status(400).json({ message: req.__('auth.invalid_token') });
      }

    } else {
      // brak Tokena
      res.status(401).json({ message: req.__("auth.no_token") });
    }
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
  return { type: "Bearer", token, expires, refreshToken }
}

function addHours(date: Date, hours: number) {
  date.setTime(date.getTime() + hours * 60 * 60 * 1000);
  return date;
}