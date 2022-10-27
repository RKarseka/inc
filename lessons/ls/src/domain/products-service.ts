import { ProductType } from "../repositories/db"
import { productsRepository } from "../repositories/products-db-repository";

export const productsService = {
  async getProductById(id: number): Promise<ProductType | null> {
    return await productsRepository.getProductById(id)
  },
  async findProducts(title: string | undefined): Promise<ProductType[]> {
    return productsRepository.findProducts(title)
  },
  async createProduct(title: string): Promise<ProductType> {
    const newProduct = {
      id: +(new Date()),
      title
    }
    const createdProduct = await productsRepository.createProduct(newProduct)
    return createdProduct
  },

  async updateProduct(id: number, title: string): Promise<boolean> {
    const result = await productsRepository.updateProduct(id, title)

    return result
  },
  async deleteProduct(id: number): Promise<boolean> {
    const result = await productsRepository.deleteProduct(id)
    return result
  }
}