import * as Image from '@/core/models/image.js'

export type Status = 'active' | 'inactive'

export class Model {
  readonly id: string
  readonly storeId: string
  readonly description: string
  readonly status: Status
  readonly images: Image.Model[]

  constructor(model: {
    id: string
    storeId: string
    description: string
    status: Status
    images: Image.Model[]
  }) {
    this.id = model.id
    this.storeId = model.storeId
    this.description = model.description
    this.status = model.status
    this.images = model.images
  }

  hasImages() {
    return this.images.length > 0
  }

  isActive() {
    return this.status === 'active'
  }

  hasMoreImagesThanAllowed() {
    return this.images.length <= 10
  }
}
