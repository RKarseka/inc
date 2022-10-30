import { checkSchema } from "express-validator"
import { blogsRepository } from "../repositories/blogs-repository"

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
    isLength: {options: {max: 100}},
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
    isLength: {options: {min: 1, max: 1000}},
    custom: {
      options: async (id: string) => {
        if (!!(await blogsRepository.getOne(id))) {
          return Promise.resolve()
        } else {
          return Promise.reject()
        }
      }

    }
  },
  Authorization
})