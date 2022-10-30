import { productsCollection, ProductType } from "./db"

export const productsRepository = {
  async findProducts(title: string | undefined): Promise<ProductType[]> {
    const filter: any = {}
    if (title) {
      filter.title = {$regex: title}
    }
    return productsCollection.find(filter).toArray()
  },
  async getProductById(id: number): Promise<ProductType | null> {
    return await productsCollection.findOne({id})
  },
  async createProduct(newProduct: ProductType): Promise<ProductType> {
    await productsCollection.insertOne(newProduct)
    return newProduct
  },

  async updateProduct(id: number, title: string): Promise<boolean> {
    const result = await productsCollection.updateOne({id}, {$set: {title}})

    return !!result.matchedCount
  },
  async deleteProduct(id: number): Promise<boolean> {
    const result = await productsCollection.deleteOne({id})
    return !!result.deletedCount
  }
}