import { ObjectId } from 'mongo'
import mongoose from 'mongoose'
import { <%= collectionNamePascalCase %>Doc } from 'interfaces/<%= interfacePath %>-doc'
import { <%= collectionNamePascalCase %> } from '@<%= projectName %>/data-model'
const <%= collectionNamePascalCase %>Model = mongoose.model<<%= collectionNamePascalCase %>Doc>('<%= collectionNamePlural %>')

const find = async (query: any): Promise<<%= collectionNamePascalCase %>[]> => {
  return await <%= collectionNamePascalCase %>Model.find(query)
}

const findOne = async (query: any): Promise<<%= collectionNamePascalCase %>> => {
  const result = await <%= collectionNamePascalCase %>Model.findOne(query)

  return result._doc as <%= collectionNamePascalCase %>
}

const getById = (id: ObjectId): any => {
  return <%= collectionNamePascalCase %>Model.findById(id)
}

const create = async (new<%= collectionNamePascalCase %>: <%= collectionNamePascalCase %>): Promise<<%= collectionNamePascalCase %>> => {
  const userInstance = new <%= collectionNamePascalCase %>Model(new<%= collectionNamePascalCase %>)
  const result = await userInstance.save()

  return result._doc as <%= collectionNamePascalCase %>
}

const update = async (new<%= collectionNamePascalCase %>: <%= collectionNamePascalCase %>): Promise<<%= collectionNamePascalCase %>> => {
  return await <%= collectionNamePascalCase %>Model.findByIdAndUpdate(new<%= collectionNamePascalCase %>._id, {...new<%= collectionNamePascalCase %>}, { new: true })
}

const destroy = async (query: any): Promise<any> => {
  return await <%= collectionNamePascalCase %>Model.remove(query)
}

export const <%= collectionNamePlural %>Repo = {
  find,
  findOne,
  getById,
  create,
  update,
  destroy
}
