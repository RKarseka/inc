import { app } from '../config'

export interface emailObject {
  from: string
  to: string
  subject: string
  text?: string
  html?: string
}

export const emailManager = {
  async sendEmailRecoveryMessage () {

  },

  makeRegistrationConfirmationEmail (to: string, code: string = 'code'): emailObject {
    const subject = ' Registration confirmation'
    const html =
      ` <h1>Thanks for your registration</h1>
        <p>To finish registration please follow the link below:
             <a href='${app.host}/registration-confirmation?code=${code}'>complete registration</a>
         </p>`

    return {
      from: app.email.from,
      to,
      subject,
      html
    }
  },

  makeRecoveryPasswordEmail (to: string, code: string = 'code'): emailObject {
    const subject = ' Registration confirmation'
    const html =
      ` <h1>Password recovery</h1>
        <p>To finish password recovery please follow the link below:
             <a href='${app.host}/password-recovery?recoveryCode=${code}'>recovery password</a>
         </p>`

    return {
      from: app.email.from,
      to,
      subject,
      html
    }
  }
}
