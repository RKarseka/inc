export const settings = {
  JWT_SECRET: process.env.JWT_SECRET || '12345',
  JWT_SECRET_AT: process.env.JWT_SECRET_AT || '123456', // accessToken
  JWT_SECRET_RT: process.env.JWT_SECRET_RT || '1234567' // refreshToken
}
