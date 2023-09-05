import nodemailer from 'nodemailer';
import envConfig from '../config/env.config';
class RecoverEmailController {
     async  sendMessageToEmail(email, code) {
        const transport = nodemailer.createTransport({
            service: "gmail",
            port:587,
            auth:{
                user: envConfig.googleName,
                pass: envConfig.googlePass,
            },
        })

        const result = await transport.sendMail({
            from: envConfig.,
            to: email,
            subject: "perdon me faltaba algo",
            html: `
            <div>
              <a href="${envConfig.httpPort}/recoverEmail/recoverPass?code=${code}&email=${email}"> hola mundo</a>
            </div>
            `
          });
          return result;
      }
}

export const recoverEmailController = new RecoverEmailController();