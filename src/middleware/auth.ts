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
          else {
            if (value) {
              req.headers.user = value.user;
              req.headers.role = value.role;
            }
            next();
          }
        });
      } catch (err) {
        res.status(400).json({ message: req.__('auth.invalid_token') });
      }

    } else {
      res.status(401).json({ message: req.__("auth.no_token") });
    }
  }
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
          const tokens = createTokenPair(user._id, "admin", this.tokenSecret);
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
            const tokens = createTokenPair(value.user, "admin", this.tokenSecret);
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
                    role: { _id: "admin", name: "Admin" },
                    roles: [{ _id: "admin", name: "Admin" }, { _id: "ceo", name: "CEO" }],
                    permissions: [
                      { resource: "transactions", type: "salesorder", level: "full" },
                      { resource: "items", type: "invitem", level: "full" },
                    ],
                  };
                  const navigation = [
                    {
                      icon: "mdi-clipboard-list-outline",
                      items: [
                        {
                          title: "Sales Orders",
                          link: "/transactions/salesorder",
                          resource: "transactions",
                          type: "salesorder",
                        },
                        {
                          title: "Invoices",
                          link: "/transactions/invoice",
                          resource: "transactions",
                          type: "salesorder",
                        },
                        { title: "Correction Notes" },
                      ],
                      title: "Sales Management",
                    },
                    {
                      icon: "mdi-dolly",
                      items: [
                        {
                          title: "Purchase Orders",
                          link: "/transactions/purchaseorder",
                          resource: "transactions",
                          type: "purchaseorder",
                        },
                        //{ title: "Deliveries" },
                        { title: "Item Receipts" },
                        {
                          title: "Shipping Methods",
                        },
                      ],
                      title: "Procurement",
                    },
                    {
                      icon: "mdi-warehouse",
                      items: [
                        {
                          title: "Item Fulfillments",
                          link: "/transactions/itemfulfillment",
                          resource: "transactions",
                          type: "itemfulfillment",
                        },
                        //{ title: "Inventory Transfer" },
                        {
                          title: "Inventory Adjustment",
                        },
                      ],
                      title: "Warehousing",
                    },
                    {
                      icon: "mdi-bank",
                      items: [
                        { title: "Exchange Rates" },
                        { title: "Payments" },
                        { title: "Refunds" },
                        {
                          title: "Payment Methods",
                          link: "/accounting/paymentmethod",
                          resource: "accounting",
                          type: "paymentmethod",
                        },
                        {
                          title: "Terms",
                          link: "/accounting/terms",
                          resource: "accounting",
                          type: "terms",
                        },
                      ],
                      title: "Accounting",
                    },
                    {
                      icon: "mdi-text-account",
                      items: [
                        { title: "Vendors" },
                        {
                          title: "Customers",
                          link: "/entities/customer",
                          resource: "entities",
                          type: "customer",
                        },
                      ],
                      title: "Entities",
                    },
                    {
                      icon: "mdi-format-list-checkbox",
                      items: [
                        {
                          title: "Inventory Items",
                          link: "/items/invitem",
                          resource: "items",
                          type: "invitem",
                        },
                        { title: "Assembly Items" },
                        { title: "Kits" },
                      ],
                      title: "Items",
                    },
                    {
                      icon: "mdi-storefront",
                      items: [{ title: "Online Store" }, { title: "Marketplace" }],
                      title: "Sales Channel",
                    },
                    {
                      icon: "mdi-calendar-check",
                      items: [
                        {
                          title: "Calendars",
                          link: "/activities/calendar",
                          resource: "activities",
                          type: "calendar",
                        },
                        {
                          title: "Project Boards",
                          link: "/activities/project",
                          resource: "activities",
                          type: "project",
                        },
                      ],
                      title: "Activities",
                    },
                    {
                      icon: "mdi-format-list-group",
                      items: [
                        {
                          title: "Price Levels",
                          link: "/classifications/pricelevel",
                          resource: "classifications",
                          type: "pricelevel",
                        },
                        {
                          title: "Price Groups",
                          link: "/classifications/pricegroup",
                          resource: "classifications",
                          type: "pricegroup",
                        },
                        {
                          title: "Groups",
                          link: "/classifications/group",
                          resource: "classifications",
                          type: "group",
                        },
                        {
                          title: "Categories",
                          link: "/classifications/category",
                          resource: "classifications",
                          type: "category",
                        },
                      ],
                      title: "Classifications",
                    },
                    {
                      icon: "mdi-email-fast-outline",
                      items: [
                        {
                          title: "E-Mail Addresses",
                          link: "/emails/email",
                          resource: "emails",
                          type: "email",
                        },
                        {
                          title: "Newsletters",
                          // link: "/marketing/newsletter/status",
                        },
                        {
                          title: "Email Templates",
                          //link: "/templates/emailtemplate/status",
                        },
                        {
                          title: "Promotions",
                          //link: "/marketing/promotion/status",
                        },
                      ],
                      title: "Marketing",
                    },
                    {
                      icon: "mdi-chart-timeline",
                      items: [
                        {
                          title: "Transaction Reports",
                          link: "/reports/report",
                          resource: "reports",
                          type: "report",
                        },
                        {
                          title: "Inventory Reports",
                          // link: "/marketing/newsletter/status",
                        },
                        {
                          title: "Customer Reports",
                          //link: "/templates/emailtemplate/status",
                        },
                      ],
                      title: "Reports",
                    },
                  ]

                  res.status(200).json({ user: userLoged, navigation });
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

function createTokenPair(user: string, role: string, tokenSecret: string) {
  const token = jwt.sign({ user: user, role: role }, tokenSecret, {
    expiresIn: "1h"
  });
  const refreshToken = jwt.sign({ user: user, role: role }, tokenSecret, {
    expiresIn: "2h"
  });
  const expires = Math.floor(addHours(new Date(), 1).getTime() / 1000);
  return { token, expires, refreshToken }
}

function addHours(date: Date, hours: number) {
  date.setTime(date.getTime() + hours * 60 * 60 * 1000);
  return date;
}