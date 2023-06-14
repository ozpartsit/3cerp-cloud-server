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
            res.status(500).json({ message: "failed to authenticate token" });
          else
            next();
        });
      } catch (err) {
        res.status(400).json({ message: "Invalid token" });
      }

    } else {
      res.status(401).json({ message: "Access denied. No token provided" });
    }
  }
  public accessGranted(
    req: express.Request,
    res: Response,
    next: express.NextFunction
  ) {
    res.status(200).json({ message: "Access granted" });
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
          const token = jwt.sign({ user: user._id, account: "test" }, this.tokenSecret, {
            expiresIn: "24h"
          });
          let userLoged = {
            name: user.name,
            date: new Date(),
            locale: user.locale
          };
          res.status(200).json({ user: userLoged, token });
        } else {
          res.status(403).json({ message: "password do not match" });
        }
      } else res.status(404).json({ message: "no user with that email found" });
    });
  }
}
