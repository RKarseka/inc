import { ParsedQs } from "qs";
import { IPost } from "./posts-service";
import { blogsRepository } from "../03.repositories/blogs-repository";
import { ISearchFields, makeGetAllParams } from "../helpers/helpers";
import { postsCollection } from "../03.repositories/db";
import { abstractRepository } from "../03.repositories/abstract-repository";


export const blogsService = {
  async getPostsByBlog(query: ParsedQs, blogId: string) {
    const blog = await blogsRepository.getOne(blogId)
    if (!blog) return

    const searchFields: ISearchFields<IPost>[] = [ {name: 'blogId', query: 'blogId'} ]
    const params = makeGetAllParams({...query, blogId}, searchFields)
    return await abstractRepository.getAllFromCollection<IPost>(params, postsCollection)
  }
}