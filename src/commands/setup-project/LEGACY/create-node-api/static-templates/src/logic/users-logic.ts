import bcrypt from 'bcrypt'
import { usersRepo } from '../data/repositories/users-repo'
import { User } from 'interfaces/User-poto'

const saltRounds = 10

export const authenticate = async (authenticationAttempt: any): Promise<User> => {
  const email = authenticationAttempt.email.toLowerCase()
  // first we grab the user document
  const user: User = await usersRepo.findOne({ email })
  // once we have the document we can actually check the password
  const hashedPassword = await bcrypt.hash(authenticationAttempt.password, user.salt)

  if (hashedPassword !== user.password) {
    throw new Error('Email or Password are incorrect')
  }

  return user
}

export const find = async (query): Promise<User[]> => {
  return usersRepo.find(query)
}

export const getById = async (id: string): Promise<User[]> => {
  return usersRepo.getById(id)
}

export const create = async (user: User): Promise<User> => {
  // password arrives in clear text
  const salt = await bcrypt.genSalt(saltRounds)
  const hashedPassword = await bcrypt.hash(user.password, salt)
  // replace it with the hashed password
  user.password = hashedPassword
  // store the salt so we can authenticate later
  user.salt = salt
  // lower email for faster queries
  user.email = user.email.toLowerCase()

  return usersRepo.create(user)
}

export const update = async (user: User): Promise<User> => {
  return usersRepo.update(user)
}

export const destroy = async (id: number): Promise<any> => {
  return usersRepo.destroy(id)
}
