import * as Image from '@/core/models/image.js'

export type Status = 'active' | 'inactive'

export type Model = Readonly<{
  id: string
  storeId: string
  description: string
  status: Status
  images: Image.Model[]
}>

export function build(model: Model) {
  return model
}

export function hasImages(model: Model) {
  return model.images.length > 0
}

export function isActive(model: Model) {
  return model.status === 'active'
}

export function hasMoreImagesThanAllowed(model: Model) {
  return model.images.length >= 10
}
