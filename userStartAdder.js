import mongoose from 'mongoose';
import User from './models/user.js';

mongoose.connect('mongodb://localhost:27017/knighechka', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const userStartAdder = async (msg) => {
  console.log(msg);
  if (msg.text === '/start') {
    const user = new User({
      telegram_id: msg.from.id,
      is_bot: msg.from.is_bot,
      first_name: msg.from.first_name,
      last_name: msg.from.last_name,
      username: msg.from.username,
      language_code: msg.from.language_code,
    });
    await user.save();
  }
};

export default userStartAdder;
