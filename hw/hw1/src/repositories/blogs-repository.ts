import { state } from "../state";

interface iBlog {
  name: string,
  description: string,
  websiteUrl: string,
  createdAt: string,
  isMembership: boolean
}

const {blogs} = state
export const blogsRepository = {
  create({name, description, websiteUrl}: iBlog) {
    const newBlog = {
      id: +(new Date()) + '',
      name,
      description,
      websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false
    }
    blogs.push(newBlog)
    return newBlog
  },
  getAll() {
    return blogs
  },
  getOne(id: string) {
    return blogs.find(i => i.id === id)
  },
  editOne(id: string, newBlog: iBlog) {
    const blog = this.getOne(id)
    if (!blog) {
      return false
    }
    Object.assign(blog, newBlog)
    return true
  },
  deleteOne(id: string) {
    const index = blogs.findIndex(p => p.id === id)
    return index !== -1 && !!blogs.splice(index, 1)
  }
}