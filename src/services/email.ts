import nodemailer from "nodemailer";
//to do - zastanowić sie nad użyciem.
import EmailTemplate from "email-templates";

import fs from "fs";
import ejs from "ejs";
import path from "path";
import { I18n } from "i18n";
import { IAccess } from "../models/access.model";
import File from "../models/storages/file/schema";
import EmailSent from "../models/emailSent.model";

export class Email {
  private transporter: any;
  private host: string = "mail0.small.pl";
  private port: number = 465;
  private secure: boolean = true;
  private user: string = "notification@3cerp.cloud";
  private pass: string = "Test1!";
  public from: string = `3C ERP CLOUD <${this.user}>`;
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
  async getBase64(img: string) {

    try {
      // Ścieżka do obrazka
      const imagePath = path.join(__dirname, 'templates', 'imgs', img);
      const data = await fs.readFileSync(imagePath);
      const base64Data = data.toString('base64');
      return "data:image/png;base64," + base64Data;
    } catch (err) {
      throw err;
    }


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

    let config: any = {
      from: this.from,
      to: email.to,
      subject: email.subject,
      text: email.text,
      html: email.text,
      attachments: []
    }
    if (email.email) {
      config.from = `${email.email.name} <${email.email.name}>`
    }
    if (email.attachments) {
      if (!Array.isArray(email.attachments)) email.attachments = [email.attachments]

      for (let attachement of email.attachments) {
        let storageFile = await File.findById(attachement);

        if (storageFile) {
          let storagePath = path.posix.resolve("storage");
          let file = {
            filename: storageFile.name,
            path: path.join(storagePath, storageFile.path),
          }
          config.attachments.push(file)
        }
      }
    }
    try {

      // let EmailModel = EmailSent.setAccount(email.account, email.user);
      let test = new EmailSent(email);
      await test.save()
    } catch (err) {
      console.log(err)
      throw err;
    }


    return await this.transporter.sendMail(config)
    //   , (error: any, info: any) => {
    //   if (error) {
    //     throw error;
    //   } else {
    //     console.log('Message sent: %s', info.messageId);
    //     return info.messageId;
    //   }

    // });
  }

  // System Templates


  //resetPassword
  async resetPassword(to: string, resetToken: string, locale = "en") {
    let template = {
      from: this.from,
      to: to,
      subject: this.emaili18n.__('3C ERP Cloud | Reset Password'),
      html: await this.render("default.ejs", { template: 'reset_password.ejs', link: resetToken, locale: locale }),
      attachments: [
        {
          filename: 'header.png',
          path: path.join(__dirname, 'templates', 'imgs', 'header.png'),
          cid: 'header' // Wartość 'cid' musi pasować do src w tagu <img>
        }
      ]
    }
    return template;
  }
  //Sign Up
  async signUp(to: string, locale = "en") {
    let template = {
      from: this.from,
      to: to,
      subject: this.emaili18n.__('3C ERP Cloud | Thanks for Reaching Out!'),
      html: await this.render("default.ejs", { template: "contact_form.ejs", locale: locale }),
      attachments: [
        {
          filename: 'header.png',
          path: path.join(__dirname, 'templates', 'imgs', 'header.png'),
          cid: 'header' // Wartość 'cid' musi pasować do src w tagu <img>
        }
      ]

    }
    return template;
  }
  //New User
  async newUser(to: string, resetToken: string, locale = "en") {
    let template = {
      from: this.from,
      to: to,
      subject: this.emaili18n.__('3C ERP Cloud | Welcome to 3C ERP Cloud!'),
      html: await this.render("default.ejs", { template: "new_user.ejs", link: resetToken, locale: locale }),
      attachments: [
        {
          filename: 'header.png',
          path: path.join(__dirname, 'templates', 'imgs', 'header.png'),
          cid: 'header' // Wartość 'cid' musi pasować do src w tagu <img>
        }
      ]

    }
    return template;
  }
}

export default new Email();