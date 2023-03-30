import { MJ_APIKEY_PRIVATE, MJ_APIKEY_PUBLIC } from "@/config";
import { Service } from "typedi";
import { Email } from "@interfaces/email.interface";

const Mailjet = require("node-mailjet");

@Service()
export class EmailSender {
  private mailjet = Mailjet.apiConnect(MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE);
  sendEmails = async (emails: Email[]) => {
    const messages = emails.map(email => ({
      "To": [email.to],
      "TemplateID": email.templateId,
      "TemplateLanguage": true,
      "Subject": email.subject,
      "Variables": email.variables
    }));

    try {
      await this.mailjet
        .post("send", { "version": "v3.1" })
        .request({
          "Globals": {
            "From": {
              "Email": "no-reply@trempel.co",
              "Name": "Trempel"
            }
          },
          "Messages": messages
        });
    } catch (e) {
      console.error(e);
    }
  };
}
