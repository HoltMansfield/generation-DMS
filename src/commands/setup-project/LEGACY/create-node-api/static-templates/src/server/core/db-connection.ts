import mongoose, { Mongoose } from 'mongoose'
import { importCollections } from '../../data/collection-manager'

let _db

export const connectToDb = async (): Promise<Mongoose> => {
  if (_db) {
    throw new Error('DB is already connected')
  }

  // make a synchronous call to import mongo models
  importCollections()
  const connectionString = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`

  _db = await mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  _db.connection.on('error', console.error.bind(console, 'connection error:'))

  return _db
}

export const getConnection = (): Mongoose => {
  return _db
}

export const closeConnection = async (): Promise<void> => {
  await _db.connection.close()
  _db = null
  return
}
