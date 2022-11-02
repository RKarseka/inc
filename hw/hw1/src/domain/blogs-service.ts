import {  ISearchFields, makeGetAllParams } from "../helpers/helpers";
import { blogsRepository } from "../repositories/blogs-repository";
import { ParsedQs } from "qs";
import { postsCollection } from "../repositories/db";
import { getAllFromCollection } from "../repositories/abstract-repository";
import { IPost } from "./posts-service";


export const blogsService = {
  async getPostsByBlog(query: ParsedQs, blogId: string) {
    const blog = await blogsRepository.getOne(blogId)
    if (!blog) return

    const searchFields: ISearchFields<IPost>[] = [ {name: 'blogId', query: 'blogId'} ]
    const params = makeGetAllParams({...query, blogId}, searchFields)
    return await getAllFromCollection<IPost>(params, postsCollection)
  }
}