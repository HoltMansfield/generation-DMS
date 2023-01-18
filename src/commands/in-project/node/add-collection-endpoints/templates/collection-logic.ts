import { <%= collectionNamePlural %>Repo } from '../data/repositories/<%= collectionNamePlural %>-repo'
import { <%= collectionNamePascalCase %> } from '@<%= projectName %>/data-model'

export const find = async (query): Promise<<%= collectionNamePascalCase %>[]> => {
  return <%= collectionNamePlural %>Repo.find(query)
}

export const getById = async (id: string): Promise<<%= collectionNamePascalCase %>[]> => {
  return <%= collectionNamePlural %>Repo.getById(id)
}

export const create = async (<%= collectionName %>: <%= collectionNamePascalCase %>): Promise<<%= collectionNamePascalCase %>> => {
  return <%= collectionNamePlural %>Repo.create(<%= collectionName %>)
}

export const update = async (<%= collectionName %>: <%= collectionNamePascalCase %>): Promise<<%= collectionNamePascalCase %>> => {
  return <%= collectionNamePlural %>Repo.update(<%= collectionName %>)
}

export const destroy = async (id: number): Promise<any> => {
  return <%= collectionNamePlural %>Repo.destroy(id)
}
