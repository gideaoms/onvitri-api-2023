import { User } from '@/user.js'

const user = new User({ name: 'This is a name', status: 'I', roles: ['common'] })

if (!user.isActive()) {
  const activatedUser = user.toActive()
  console.log(activatedUser)
} else {
  console.log(user)
}

export const Test = 3
