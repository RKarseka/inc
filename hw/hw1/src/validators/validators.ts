import { checkSchema } from "express-validator"
import { blogsRepository } from "../repositories/blogs-repository";
import { ObjectId } from "mongodb";

const creds = 'Basic YWRtaW46cXdlcnR5'
const websiteUrlRegex = '^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$'
const Authorization = {equals: {options: creds}}
const midreg = '^[0-9a-fA-F]{24}$'
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
    custom: {
      options: (id: string) => ObjectId.isValid(id) && (String)(new ObjectId(id)) === id
    },
    // custom: {
    //   options: async (id: string) => {
    //     if (!!(await blogsRepository.getOne(id))) {
    //       return Promise.resolve()
    //     } else {
    //       return Promise.reject()
    //     }
    //   }
    // },
    // trim: {},
    // isLength: {options: {min: 24, max: 26}}
    // matches: {options: midreg}
  },
  Authorization
})
// 63189b06003380064c4193be
// 641cf608f05a7046e01a3030
// 641cf5fff05a7046e01a2ffc
// 641cfc4c5b72ff7c31fb339c