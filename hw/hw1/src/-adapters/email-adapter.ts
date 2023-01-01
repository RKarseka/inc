import nodemailer from 'nodemailer'
import { emailObject } from '../-managers/email-manager'

const emailConfig = {
  service: 'gmail',
  auth: {
    user: 'ramaninc8@gmail.com',
    pass: 'fxjg mhse oppv terd'
  }
}

export const emailAdapter = {
  async sendEmail (emailObject: emailObject) {
    const transporter = nodemailer.createTransport(emailConfig)
    return await transporter.sendMail(emailObject)
  }
}

/*

{
  from: '"Fred Foo 👻" <ra@example1.com>', // sender address
    to: email, // list of receivers
  subject: subject, // Subject line
  text: 'Hello world?', // plain text body
  html: massage // html body
} */
