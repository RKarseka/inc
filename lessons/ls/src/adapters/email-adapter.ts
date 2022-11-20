import nodemailer from 'nodemailer'

export const emailAdapter = {
  async sendEmail(email: string, message: string, subject: string) {
    let transporter = nodemailer.createTransport({
      host: 'smtp.server.com',
      port: 587,
      secure: false,
      auth: {
        user: 'user',
        pass: 'pass'
      }
    })

    const info = await transporter.sendMail({
      from: '"Fred Foo 👻" <foo@example.com>', // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      text: "Hello world?", // plain text body
      html: message, // html body
    })
    return info
  }
}