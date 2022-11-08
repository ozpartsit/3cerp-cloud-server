import nodemailer from "nodemailer";
import EmailTemplate from "email-templates";
import path from "path";

export default class Email {
  private transporter: any;
  private host: string = "mail0.small.pl";
  private port: number = 465;
  private secure: boolean = true;
  private user: string = "test@lukens.smallhost.pl";
  private pass: string = "^7juHr3%3GcVK.0mI8f8s-1SN7il.Z";
  public email: any;
  constructor(sender: any) {
    this.transporter = nodemailer.createTransport({
      host: sender.host,
      port: sender.port,
      secure: sender.secure, // true for 465, false for other ports
      auth: {
        user: sender.user,
        pass: sender.pass
      }
    });
    this.email = new EmailTemplate({
      message: {
        from: sender.user
      },
      //send: true,
      transport: this.transporter,
      views: {
        root: path.resolve("src"),
        options: {
          extension: "ejs" // <---- HERE
        }
      }
    });
  }

  public send(message: any = {}, data: any = {}, template: string) {
    this.email
      .send({
        template: "views",
        locals: {
          name: { a: "Elon" }
        },
        message: {
          to: "it@ozparts.eu"
        }
      })
      .then(console.log)
      .catch(console.error);
  }
}
