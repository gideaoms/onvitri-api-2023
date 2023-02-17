import errors from 'http-errors'
import * as ProductRepository from '@/core/repositories/product.js'
import * as ProductModel from '@/core/models/product.js'
import * as Either from '@/utils/either.js'

export class Repository implements ProductRepository.Repository {
  private readonly _products: ProductModel.Model[] = []

  async findOne(productId: string) {
    const product = this._products.find(product => product.id === productId)
    if (!product) {
      return Either.failure(new errors.NotFound('Product not found'))
    }
    return Either.success(
      ProductModel.build({
        id: '123',
        storeId: '123',
        description: 'Any description',
        status: 'active',
        images: [],
      }),
    )
  }

  async remove(product: ProductModel.Model) {
    const index = this._products.findIndex(current => current.id === product.id)
    this._products.slice(index, 1)
  }

  async create(product: ProductModel.Model) {
    const newProduct = Object.assign(product, {
      id: String(this._products.length + 1),
    })
    this._products.push(newProduct)
    return newProduct
  }

  async update(product: ProductModel.Model) {
    const index = this._products.findIndex(current => current.id === product.id)
    this._products[index] = product
    return product
  }
}
