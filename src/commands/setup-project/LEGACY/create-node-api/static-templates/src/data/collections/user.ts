// eslint-disable-next-line @typescript-eslint/no-var-requires
import mongoose from 'mongoose'

// POJO
const schema = {
  userName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  salt: { type: String }
}

// compiled as mongoose schema
const compiledSchema = new mongoose.Schema(schema)

module.exports = {
  schema,
  compiledSchema
}
