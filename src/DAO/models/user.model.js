import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'
const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    max: 100,
  },
  lastName: {
    type: String,
    required: true,
    max: 100,
  },
  email: {
    type: String,
    required: true,
    max: 100,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    max: 100,
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  age: {
    type: Number,
    required: true,
    min: 13,
    max: 100,
  },
  role: {
    type: String,
    required: true,
    default: 'usuario',
  },
  cart: {
    type: String,
  },
});
userSchema.plugin(mongoosePaginate);
export const UserModel = model('users', userSchema);