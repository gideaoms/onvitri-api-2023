export type Size = 'normal' | 'mini'

export type Model = Readonly<{
  url: string
  name: string
  ext: string
  width: number
  height: number
  size: Size
  bucket: string
}>

export function build(model: Model) {
  return model
}
