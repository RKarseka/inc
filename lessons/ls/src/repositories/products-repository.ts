import { ProductType } from "./db";

const products: ProductType[] = [ {id: 1, title: 'tomato'}, {id: 2, title: 'orange'} ]

export const productsRepository = {
  async getProductById(id: number): Promise<ProductType | undefined> {
    return products.find(p => p.id === id)
  },
  async findProducts(title: string | undefined): Promise<ProductType[]> {
    if (title) {
      return products.filter(p => p.title.indexOf(title) > -1)
    } else {
      return products
    }
  },
  async createProduct(title: string): Promise<ProductType> {
    const newProduct = {
      id: +(new Date()),
      title
    }
    products.push(newProduct)
    return newProduct
  },
  async updateProduct(id: number, title: string): Promise<boolean> {
    const product = await this.getProductById(id)
    if (!product) {
      return false
    }
    product.title = title
    return true
  },
  async deleteProduct(id: number): Promise<boolean> {
    const productIndex = products.findIndex(p => p.id === id)
    return productIndex !== -1 && !!products.splice(productIndex, 1)
  }
}