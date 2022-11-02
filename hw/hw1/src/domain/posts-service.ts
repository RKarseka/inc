import { Request, Response } from "express";
import { blogsRepository } from "../repositories/blogs-repository";
import { postsRepository } from "../repositories/posts-repository";
import { ParsedQs } from "qs";
import { ISearchFields, makeGetAllParams } from "../helpers/helpers";
import { getAllFromCollection } from "../repositories/abstract-repository";
import { postsCollection } from "../repositories/db";

export interface IPost {
  id: string,
  title: string,
  shortDescription: string,
  content: string,
  blogId: string,
  blogName: string,
  createdAt: string
}

export const postsService = {
  async getAllPosts(query: ParsedQs) {
    const searchFields: ISearchFields<IPost>[] = []
    const params = makeGetAllParams(query, searchFields)
    return await getAllFromCollection<IPost>(params, postsCollection)
  }
}

//rest
export const createPost = async (req: Request, res: Response) => {
  const blog = await blogsRepository.getOne(req.params.blogId || req.body.blogId)
  if (!blog) {
    return res.send(404)
  }
  res.status(201).send(await postsRepository.create({
    ...req.body,
    blogId: req.params.blogId || req.body.blogId,
    blogName: blog.name
  }))
}