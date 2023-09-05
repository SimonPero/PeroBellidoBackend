import nodemailer from 'nodemailer';

class RecoverEmailController {
     async  sendMessageToEmail(email, code) {
        const transport = nodemailer.createTransport({
            service: "gmail",
            port:587,
            auth:{
                user: "cuantonombre1@gmail.com",
                pass: "nqsrcjucsridjnpt",
            },
        })

        const result = await transport.sendMail({
            from: "cuantonombre1@gmail.com",
            to: email,
            subject: "perdon me faltaba algo",
            html: `
            <div>
              <a href="http://localhost:8080/recoverEmail/recoverPass?code=${code}&email=${email}"> hola mundo</a>
            </div>
            `
          });
          return result;
      }
}

export const recoverEmailController = new RecoverEmailController();