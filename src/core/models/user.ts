export type Status = 'active' | 'inactive'

export type Model = Readonly<{
  id: string
  name: string
  email: string
  validationCode: string | null
  status: Status
  token: string
}>

export function build(model: Model) {
  return model
}

export function isActive(model: Model) {
  return model.status === 'active'
}
