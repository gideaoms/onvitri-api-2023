import * as ImageModel from '@/core/models/image.js'

export type Status = 'active' | 'inactive'

export type Model = Readonly<{
  id: string
  storeId: string
  description: string
  status: Status
  images: ImageModel.Model[]
}>

export function build(model: Model) {
  return model
}

export function hasImage(model: Model) {
  return model.images.length > 0
}

export function hasMoreImageThanAllowed(model: Model) {
  const max = 10
  return model.images.length > max
}

export function isActive(model: Model) {
  return model.status === 'active'
}
