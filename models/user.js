import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const userSchema = new Schema({
  telegram_id: { 
    type: String,
    unique: true,
  },
  is_bot: Boolean,
  first_name: String,
  last_name: String,
  username: { 
    type: String,
    unique: true,
  },
  language_code: String,
});

export default model('User', userSchema);
