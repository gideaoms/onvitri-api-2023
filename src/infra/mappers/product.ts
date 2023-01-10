import { Prisma, Product } from '@prisma/client'
import { Type, Static } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'
import * as Models from '@/core/models/mod.js'

const ImageSchema = Type.Array(
  Type.Object({
    id: Type.String(),
    variants: Type.Array(
      Type.Object({
        url: Type.String(),
        name: Type.String(),
        ext: Type.String(),
        width: Type.Number(),
        height: Type.Number(),
        size: Type.Enum({ mini: 'mini' as const, normal: 'normal' as const }),
        bucket: Type.String(),
      }),
    ),
  }),
)

function assertImages(images: Prisma.JsonValue): asserts images is Static<typeof ImageSchema> {
  if (!Value.Check(ImageSchema, images)) {
    throw new Error('Invalid images field', { cause: images })
  }
}

export function toModel(record: Product) {
  assertImages(record.images)
  return new Models.Product.Model({
    id: record.id,
    storeId: record.store_id,
    description: record.description,
    status: record.status,
    images: record.images.map(
      image =>
        new Models.Image.Model({
          id: image.id,
          variants: image.variants.map(
            variant =>
              new Models.Variant.Model({
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
  assertImages(record.images)
  return {
    id: record.id,
    description: record.description,
    status: record.status,
    images: record.images.map(image => ({
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

export function fromModel(model: Models.Product.Model) {
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
  }
}
