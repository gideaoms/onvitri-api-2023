export declare namespace Image {
  type Variant = {
    url: string
    name: string
    ext: string
    width: number
    height: number
    size: 'sm' | 'md'
  }
}

export class Image {
  public readonly id: string
  public readonly variants: Image.Variant[]

  public constructor(image: { id: string; variants: Image.Variant[] }) {
    this.id = image.id
    this.variants = image.variants
  }
}
