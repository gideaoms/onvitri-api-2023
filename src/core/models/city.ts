export type Model = Readonly<{
  id: string
  name: string
  initials: string
}>

export function build(model: Model) {
  return model
}
