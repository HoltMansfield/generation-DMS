import { faker } from '@faker-js/faker'

export const getString = (): string => faker.lorem.word()
export const getNumber = (): number => faker.datatype.number()
export const getBoolean = (): boolean => faker.datatype.boolean()
export const getDatetime = (): Date => faker.datatype.datetime()
export const getArrayOfStrings = (length = 5): string[] => Array.from({ length }, getString)
export const getArrayOfNumbers = (length = 5): number[] => Array.from({ length }, getNumber)
export const getArrayOfBooleans = (length = 5): boolean[] => Array.from({ length }, getBoolean)
export const getArrayOfDatetimes = (length = 5): Date[] => Array.from({ length }, getDatetime)

export default {
  getString,
  getNumber,
  getBoolean,
  getDatetime,
  getArrayOfStrings,
  getArrayOfNumbers,
  getArrayOfBooleans,
  getArrayOfDatetimes
}
