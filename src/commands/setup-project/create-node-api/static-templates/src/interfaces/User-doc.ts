import { Document } from 'mongoose'
import { ObjectId } from 'mongo'
import { MongoResult } from './holto-cli/mongo-result'

export interface UserDoc extends Document, MongoResult {
  _id: ObjectId
  userName: string
  email: string
  password: string
  firstName?: string
  lastName?: string
  salt?: string
}
