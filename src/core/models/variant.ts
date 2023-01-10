export type Size = 'normal' | 'mini'

export class Model {
  readonly url: string
  readonly name: string
  readonly ext: string
  readonly width: number
  readonly height: number
  readonly size: Size
  readonly bucket: string

  constructor(model: {
    url: string
    name: string
    ext: string
    width: number
    height: number
    size: Size
    bucket: string
  }) {
    this.url = model.url
    this.name = model.name
    this.ext = model.ext
    this.width = model.width
    this.height = model.height
    this.size = model.size
    this.bucket = model.bucket
  }
}
