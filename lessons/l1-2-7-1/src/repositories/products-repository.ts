const products = [ {id: 1, title: 'tomato'}, {id: 2, title: 'orange'} ]

export const productsRepository = {
  getProductById(id: number) {
    return products.find(p => p.id === id)
  },
  findProducts(title: string | undefined) {
    if (title) {
      return products.filter(p => p.title.indexOf(title) > -1)
    } else {
      return products
    }
  },
  createProduct(title: string) {
    const newProduct = {
      id: +(new Date()),
      title
    }
    products.push(newProduct)
    return newProduct
  },
  updateProduct(id: number, title: string) {
    const product = this.getProductById(id)
    if (!product) {
      return null
    }
    product.title = title
    return true
  },
  deleteProduct(id: number) {
    const productIndex = products.findIndex(p => p.id === id)
    return productIndex !== -1 && !!products.splice(productIndex, 1)
  }
}