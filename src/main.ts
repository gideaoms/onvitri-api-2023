import { User } from '@/core/user.js'

export const user = new User({ name: 'This is a name', status: 'I', roles: ['common'] })

console.log(user)
