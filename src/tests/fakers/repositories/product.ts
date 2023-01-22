import errors from 'http-errors'
import * as Repositories from '@/core/repositories/mod.js'
import * as Models from '@/core/models/mod.js'
import * as Either from '@/utils/either.js'

export class Repository implements Repositories.Product.Repository {
  private readonly _products: Models.Product.Model[] = []

  async findOne(productId: string) {
    const product = this._products.find(product => product.id === productId)
    if (!product) {
      return Either.failure(new errors.NotFound('Product not found'))
    }
    return Either.success(
      Models.Product.build({
        id: '123',
        storeId: '123',
        description: 'Any description',
        status: 'active',
        images: [],
      }),
    )
  }

  async remove(product: Models.Product.Model) {
    const index = this._products.findIndex(current => current.id === product.id)
    this._products.slice(index, 1)
  }

  async create(product: Models.Product.Model) {
    const newProduct = Object.assign(product, { id: String(this._products.length + 1) })
    this._products.push(newProduct)
    return newProduct
  }

  async update(product: Models.Product.Model) {
    const index = this._products.findIndex(current => current.id === product.id)
    this._products[index] = product
    return product
  }
}
