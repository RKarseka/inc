import { checkSchema, cookie } from 'express-validator'
import { blogsRepository } from '../03.repositories/blogs-repository'

const creds = 'Basic YWRtaW46cXdlcnR5'
const websiteUrlRegex = '^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$'
const loginRegex = '^[a-zA-Z0-9_-]*$'
const emailRegex = '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'
const Authorization = { equals: { options: creds } }

export const vAuth = checkSchema({ Authorization })
export const vEComment = checkSchema({
  content: {
    trim: {},
    isLength: { options: { min: 20, max: 300 } }
  }
})
export const vLikeComment = checkSchema({
  likeStatus: {
    trim: {},
    isIn: {options: [[ 'None', 'Like', 'Dislike' ]]},
    notEmpty: true
  }
})
export const vCEBlog = checkSchema({
  name: {
    trim: {},
    isLength: { options: { min: 1, max: 15 } }
  },
  description: {
    trim: {},
    isLength: { options: { min: 1, max: 500 } }
  },
  websiteUrl: {
    trim: {},
    isLength: { options: { max: 100 } },
    matches: { options: websiteUrlRegex }
  },
  Authorization
})
export const vBlogID = checkSchema({
  blogId: {
    custom: {
      options: async (id: string) => {
        if ((await blogsRepository.getOne(id)) != null) {
          return await Promise.resolve()
        } else {
          return await Promise.reject()
        }
      }
    }
  }
})
export const vCEPost = checkSchema({
  title: {
    trim: {},
    isLength: { options: { min: 1, max: 30 } }
  },
  shortDescription: {
    trim: {},
    isLength: { options: { min: 1, max: 100 } }
  },
  content: {
    trim: {},
    isLength: { options: { min: 1, max: 1000 } }
  },
  Authorization
})

export const vLogin = checkSchema({
  loginOrEmail: {
    trim: {},
    isLength: { options: { min: 1, max: 1000 } }
  },
  password: {
    trim: {},
    isLength: { options: { min: 6, max: 10 } }
  }
})

export const vCUser = checkSchema({
  login: {
    trim: {},
    isLength: { options: { min: 3, max: 10 } },
    matches: { options: loginRegex }
  },
  password: {
    trim: {},
    isLength: { options: { min: 6, max: 20 } }
  },
  email: {
    trim: {},
    matches: { options: emailRegex }
  }
})

export const vCEmail = checkSchema({
  email: {
    trim: {},
    matches: { options: emailRegex }
  }
})

export const vCEComment = checkSchema({
  content: {
    trim: {},
    isLength: { options: { min: 20, max: 300 } }
  }
})

export const vACode = checkSchema({
  code: {
    trim: {},
    isLength: { options: { min: 22, max: 24 } }
  }
})

export const vAPasswordRecovery = checkSchema({
  recoveryCode: {
    trim: {},
    isLength: { options: { min: 1 } }
  },
  newPassword: {
    trim: {},
    isLength: { options: { min: 6, max: 20 } }
  }
})
//
// export const vARefreshToken = checkSchema({
//   accessToken: {
//     trim: {},
//     isLength: {options: {min: 1}}
//   }
// })
