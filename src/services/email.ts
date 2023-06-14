import nodemailer from "nodemailer";
import EmailTemplate from "email-templates";
import ejs from "ejs";
import path from "path";

export default class Email {
  private transporter: any;
  private host: string = "mail0.small.pl";
  private port: number = 465;
  private secure: boolean = true;
  private user: string = "notification@3cerp.cloud";
  private pass: string = "Test1!";
  public email: any;
  constructor() {
    this.transporter = nodemailer.createTransport({
      pool: true,
      host: this.host,
      port: this.port,
      secure: this.secure, // true for 465, false for other ports
      auth: {
        user: this.user,
        pass: this.pass
      }
    });
    // this.email = {
    //   from: 'test@ozparts.eu',
    //   to: 'it@ozparts.eu',
    //   subject: 'test',
    //   html: 'test'
    // }
  }

  public async send(email: any = {}) {
    return await this.transporter.sendMail(email)
    //   , (error: any, info: any) => {
    //   if (error) {
    //     throw error;
    //   } else {
    //     console.log('Message sent: %s', info.messageId);
    //     return info.messageId;
    //   }

    // });
  }
}
