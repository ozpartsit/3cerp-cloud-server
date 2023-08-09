import nodemailer from "nodemailer";
import EmailTemplate from "email-templates";

import ejs from "ejs";
import path from "path";
import { I18n } from "i18n";
export class Email {
  private transporter: any;
  private host: string = "mail0.small.pl";
  private port: number = 465;
  private secure: boolean = true;
  private user: string = "notification@3cerp.cloud";
  private pass: string = "Test1!";
  public email: any;
  emaili18n = new I18n();

  constructor() {
    //ustawienie lokalizacji biblioteki
    this.emaili18n.configure({
      directory: path.join(__dirname, 'templates', "/locales"),
    });
    // konfiguracja bramki wychodzącej
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
  }

  async verify() {
    this.transporter.verify(function (error, success) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email Server is ready.");
      }
    });
  }


  async render(template: string, options: any) {
    // i18n
    this.emaili18n.setLocale(options.locale || 'en');
    options.i18n = this.emaili18n;

    const emailContent = await ejs.renderFile(path.join(__dirname, 'templates', template), options);
    return emailContent;
  }
  // to do - dodać interfejs i możliwość tablicy
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

export default new Email();