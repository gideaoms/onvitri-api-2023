import { Image } from '@/core/entities/image.js'

export declare namespace Product {
  type Status = 'active' | 'inactive'
}

export class Product {
  public readonly id: string
  public readonly storeId: string
  public readonly description: string
  public readonly status: Product.Status
  public readonly images: Image[]

  public constructor(product: {
    id: string
    storeId: string
    description: string
    status: Product.Status
    images: Image[]
  }) {
    this.id = product.id
    this.storeId = product.storeId
    this.description = product.description
    this.status = product.status
    this.images = product.images
  }

  public hasImages() {
    return this.images.length > 0
  }

  public isActive() {
    return this.status === 'active'
  }

  public hasMoreImagesThanAllowed() {
    return this.images.length <= 10
  }
}
