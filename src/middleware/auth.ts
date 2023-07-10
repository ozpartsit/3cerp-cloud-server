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
          if (err)
            res.status(500).json({ message: req.__('auth.failed_auth_token') });
          else
            next();
        });
      } catch (err) {
        res.status(400).json({ message: req.__('auth.invalid_token') });
      }

    } else {
      res.status(401).json({ message: req.__("auth.no_token") });
    }
  }
  public accessGranted(
    req: express.Request,
    res: Response,
    next: express.NextFunction
  ) {
    res.status(200).json({ message: req.__("auth.access_granted") });
  }
  public login(
    req: express.Request,
    res: Response,
    next: express.NextFunction
  ) {
    Entity.findOne({ email: req.body.email }).then(async (user) => {
      if (user) {
        const valide = await user.validatePassword(req.body.password);
        if (valide) {
          const tokens = createTokenPair(user._id, this.tokenSecret);
          res.status(200).json(tokens);
        } else {
          res.status(403).json({ message: req.__("auth.wrong_password") });
        }
      } else res.status(404).json({ message: req.__("auth.user_not_exist") });
    });
  }
  public refreshToken(
    req: express.Request,
    res: Response,
    next: express.NextFunction
  ) {
    if (req.body.refreshToken) {
      try {
        jwt.verify(req.body.refreshToken, this.tokenSecret, (err, value) => {
          if (err)
            res.status(500).json({ message: req.__('auth.failed_auth_token') });
          else {
            const tokens = createTokenPair(value.user, this.tokenSecret);
            res.status(200).json(tokens);
          }
        });
      } catch (err) {
        res.status(400).json({ message: req.__('auth.invalid_token') });
      }

    } else {
      res.status(401).json({ message: req.__("auth.no_token") });
    }
  }
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
          if (err)
            res.status(500).json({ message: req.__('auth.failed_auth_token') });
          else {
            if (value && value.user) {
              Entity.findOne({ _id: value.user }).then(async (user) => {
                if (user) {
                  let userLoged = {
                    name: user.name,
                    locale: user.locale,
                    role: "TODO",

                  };
                  res.status(200).json({ user: userLoged });
                }
              })
            }
          }
        });
      } catch (err) {
        res.status(400).json({ message: req.__('auth.invalid_token') });
      }

    } else {
      res.status(401).json({ message: req.__("auth.no_token") });
    }
  }
}

function createTokenPair(user: string, tokenSecret: string) {
  const token = jwt.sign({ user: user }, tokenSecret, {
    expiresIn: "1h"
  });
  const refreshToken = jwt.sign({ user: user }, tokenSecret, {
    expiresIn: "2h"
  });
  return { token, refreshToken }
}