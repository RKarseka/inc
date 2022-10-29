import { state } from "../state";

interface iPost {
  title: string,
  shortDescription: string,
  content: string,
  blogId: string,
  blogName: string,
  createdAt: string,
  isMembership: boolean
}

const {posts} = state
export const postsRepository = {
  create({title, shortDescription, content, blogId, blogName}: iPost) {
    const newPost = {
      id: +(new Date()) + '',
      title,
      shortDescription,
      content,
      blogId,
      blogName,
      createdAt: new Date().toISOString(),
      isMembership: false
    }
    posts.push(newPost)
    return newPost
  },
  getAll() {
    return posts
  },
  getOne(id: string) {
    return posts.find(i => i.id === id)
  },
  editOne(id: string, newBlog: iPost) {
    const blog = this.getOne(id)
    if (!blog) {
      return false
    }
    Object.assign(blog, newBlog)
    return true
  },
  deleteOne(id: string) {
    const index = posts.findIndex(p => p.id === id)
    return index !== -1 && !!posts.splice(index, 1)
  }
}