import Auth from "../middleware/auth";
import express, { Request, Response, NextFunction } from "express";

export default class EmitEvents {
  public Auth: Auth = new Auth();
  public Path: string = "/events";
  public ContentType: string = "text/event-stream";
  public CacheControl: string = "no-cache";
  public Connection: string = "keep-alive";
  public Origin: string = "*";

  public start(app: express.Application): void {
    console.log(`Start Emit Events, ${this.Path}`);
    app.get(this.Path, (req: Request, res: Response) => {
      res.writeHead(200, {
        "Content-Type": this.ContentType,
        "Cache-Control": this.CacheControl,
        Connection: this.Connection,
        "Access-Control-Allow-Origin": this.Origin
      });
      res.flushHeaders();

      let i = 0;
      setInterval(() => {
        res.write(`id: ${i}\n`);
        res.write(`event: event1\n`);
        res.write(`data: Message -- ${Date.now()}`);
        res.write(`\n\n`);
        i++;
      }, 5000);
    });
  }
}
