import { Product } from '@/core/product.js'

type ProductRepository = {
  findManyByStore(storeId: string): Promise<Product[]>
}

export { ProductRepository }
