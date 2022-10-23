import { body, check, checkSchema } from "express-validator"

const creds = 'Basic YWRtaW46cXdlcnR5'
const websiteUrlRegex = '^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$'
const Authorization = {equals: {options: creds}}
export const vCEBlog = checkSchema({
  name: {
    trim: {},
    isLength: {options: {min: 1, max: 15}}
  },
  description: {
    trim: {},
    isLength: {options: {min: 1, max: 500}}
  },
  websiteUrl: {
    trim: {},
    isLength: {options: {min: 1, max: 100}},
    matches: {options: websiteUrlRegex}
  },
  Authorization
})
export const vCEPost = checkSchema({
  title: {
    trim: {},
    isLength: {options: {min: 1, max: 30}}
  },
  shortDescription: {
    trim: {},
    isLength: {options: {min: 1, max: 100}}
  },
  content: {
    trim: {},
    isLength: {options: {min: 1, max: 1000}}
  },
  blogId: {
    trim: {},
    isLength: {options: {min: 1, max: 1000}}
  },
  Authorization
})