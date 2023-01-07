import * as Image from '@/infra/types/image.js'

export type Record = {
  id: string
  store_id: string
  description: string
  status: 'active' | 'inactive'
  images: Image.Record[]
}

export type Object = {
  id: string
  store_id: string
  description: string
  status: string
  images: Image.Object[]
}
