import { state } from "../state";

interface iBlog {
  name: string,
  description: string,
  websiteUrl: string
}

const {blogs} = state
export const blogsRepository = {
  create(item: iBlog) {
    const newBlog = {id: +(new Date()) + '', ...item}
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