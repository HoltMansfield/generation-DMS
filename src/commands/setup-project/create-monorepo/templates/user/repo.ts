import { ObjectId } from 'mongo'
import mongoose from 'mongoose'
import { UserDoc } from 'interfaces/User-doc'
import { User } from '@<%= projectName %>/data-model'

const UserModel = mongoose.model<UserDoc>('users')

interface MongoResult {
  _doc: any
}

const find = async (query: any): Promise<User[]> => {
  return await UserModel.find(query)
}

const findOne = async (query: any): Promise<User> => {
  const result = await UserModel.findOne(query)

  return result._doc as User
}

const getById = (id: ObjectId): any => {
  return UserModel.findById(id)
}

const create = async (newUser: User): Promise<User> => {
  const userInstance = new UserModel(newUser)
  const result = await userInstance.save()

  return result._doc as User
}

const update = async (newUser: User): Promise<User> => {
  return await UserModel.findByIdAndUpdate(newUser._id, {...newUser}, { new: true })
}

const destroy = async (query: any): Promise<any> => {
  return await UserModel.remove(query)
}

export const usersRepo = {
  find,
  findOne,
  getById,
  create,
  update,
  destroy
}
