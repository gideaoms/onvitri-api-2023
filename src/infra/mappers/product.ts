import { Product } from '@prisma/client'
import { z } from 'zod'
import * as ProductModel from '@/core/models/product.js'
import * as ImageModel from '@/core/models/image.js'
import * as VariantModel from '@/core/models/variant.js'

const schema = z.array(
  z.object({
    id: z.string(),
    variants: z.array(
      z.object({
        url: z.string(),
        name: z.string(),
        ext: z.string(),
        width: z.number(),
        height: z.number(),
        size: z.enum(['mini', 'normal']),
        bucket: z.string(),
      }),
    ),
  }),
)

export function toModel(record: Product) {
  const parsed = schema.parse(record.images)
  return ProductModel.build({
    id: record.id,
    storeId: record.store_id,
    description: record.description,
    status: record.status,
    images: parsed.map(image =>
      ImageModel.build({
        id: image.id,
        variants: image.variants.map(variant =>
          VariantModel.build({
            url: variant.url,
            name: variant.name,
            ext: variant.ext,
            width: variant.width,
            height: variant.height,
            size: variant.size,
            bucket: variant.bucket,
          }),
        ),
      }),
    ),
  })
}

export function toObject(record: Product) {
  const parsed = schema.parse(record.images)
  return {
    id: record.id,
    store_id: record.store_id,
    description: record.description,
    status: record.status,
    images: parsed.map(image => ({
      id: image.id,
      variants: image.variants.map(variant => ({
        url: variant.url,
        name: variant.name,
        ext: variant.ext,
        width: variant.width,
        height: variant.height,
        size: variant.size,
        bucket: variant.bucket,
      })),
    })),
  }
}

export function fromModel(model: ProductModel.Model) {
  return {
    id: model.id,
    store_id: model.storeId,
    description: model.description,
    status: model.status,
    images: model.images.map(image => ({
      id: image.id,
      variants: image.variants.map(variant => ({
        url: variant.url,
        name: variant.name,
        ext: variant.ext,
        width: variant.width,
        height: variant.height,
        size: variant.size,
        bucket: variant.bucket,
      })),
    })),
  } satisfies Omit<Product, 'created_at' | 'updated_at'>
}
