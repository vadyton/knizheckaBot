import TelegramBot from 'node-telegram-bot-api';
import mongoose from 'mongoose';
import User from './models/user.js';
import Transaction from './models/transaction.js';
import TotalDebt from './models/totalDebt.js';
import userStartAdder from './userStartAdder.js';
// import checkLoanForMe from './checkers/checkLoanForMe.js';
// import checkLoanForSomeone from './checkers/checkLoanForSomeone.js';
// import checkDebtForMe from './checkers/checkDebtForMe.js';
// import checkDebtForSomeone from './checkers/checkDebtForSomeone.js';
const TOKEN = '1302175950:AAEHn83GEwya-U1i8MUFJH0P49Wq2cM7ZB8';
const bot = new TelegramBot(TOKEN, {
  polling: true,
});

mongoose.connect('mongodb://localhost:27017/knighechka', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

bot.sendMessage;

bot.on('message', userStartAdder);

bot.on('message', async (msg) => {
  if (msg.text.toLowerCase().match('я занял')) {
    const user = await User.findOne({
      username: msg.chat.username,
    });
    const targetUser = await User.findOne({
      username: msg.text.split(' ').splice(2, 1).join(''),
    });
    const value = msg.text.split(' ').splice(3, 1).join('');
    const total = await TotalDebt.findOne({
      from: user._id,
      to: targetUser._id,
    });
    if (total) {
      total.count += +value;
      await total.save();
    } else {
      const totalDebt = new TotalDebt({
        count: value,
        from: user._id,
        to: targetUser._id,
      });
      await totalDebt.save();
    }
    const transaction = new Transaction({
      count: value,
      from: user._id,
      to: targetUser._id,
    });
    await transaction.save();
    bot.sendMessage(
      targetUser.telegram_id,
      `${msg.chat.first_name} ${msg.chat.last_name} занял тебе ${value}₽`,
    );
  }
  if (
    msg.text.toLowerCase().match('мне занял') ||
    msg.text.toLowerCase().match('занял мне')
  ) {
    const user = await User.findOne({
      username: msg.chat.username,
    });
    const targetUser = await User.findOne({
      username: msg.text.split(' ').splice(0, 1).join(''),
    });
    const value = msg.text.split(' ').splice(3, 1).join('');
    const total = await TotalDebt.findOne({
      from: targetUser._id,
      to: user._id,
    });
    if (total) {
      total.count += +value;
      await total.save();
    } else {
      const totalDebt = new TotalDebt({
        count: value,
        from: targetUser._id,
        to: user._id,
      });
      await totalDebt.save();
    }
    const transaction = new Transaction({
      count: value,
      from: targetUser._id,
      to: user._id,
    });
    await transaction.save();
    bot.sendMessage(
      targetUser.telegram_id,
      `${msg.chat.first_name} ${msg.chat.last_name} занял у тебя ${value}₽`,
    );
  }
  if (msg.text.toLowerCase().match('сколько я должен')) {
    const user = await User.findOne({
      username: msg.chat.username,
    });
    const targetUser = await User.findOne({
      username: msg.text.split(' ').splice(3, 1).join(''),
    });
    const totalDebt = await TotalDebt.findOne({
      from: targetUser._id,
      to: user._id,
    });
    if (totalDebt) bot.sendMessage(msg.chat.id, `${totalDebt.count}₽`);
    else bot.sendMessage(msg.chat.id, '0₽');
  }
  if (msg.text.toLowerCase().match('сколько мне должен')) {
    const user = await User.findOne({
      username: msg.chat.username,
    });
    const targetUser = await User.findOne({
      username: msg.text.split(' ').splice(3, 1).join(''),
    });
    const totalDebt = await TotalDebt.findOne({
      from: user._id,
      to: targetUser._id,
    });
    if (totalDebt) bot.sendMessage(msg.chat.id, `${totalDebt.count}₽`);
    else bot.sendMessage(msg.chat.id, '0₽');
  }
  if (msg.text.toLowerCase().match('я отдал')) {
    const value = msg.text.split(' ').splice(3, 1).join('');
    const user = await User.findOne({
      username: msg.chat.username,
    });
    const targetUser = await User.findOne({
      username: msg.text.split(' ').splice(2, 1).join(''),
    });
    const total = await TotalDebt.findOne({
      from: targetUser._id,
      to: user._id,
    });
    if (value === 'все' || value === 'всё') {
      total.remove();
      bot.sendMessage(msg.chat.id, 'Красава!');
      bot.sendMessage(targetUser.telegram_id, `${user.username} погасил долг`);
    } else {
      total.count -= +value;
      await total.save();
      bot.sendMessage(
        targetUser.telegram_id,
        `${user.username} должен еще ${total.count}₽`,
      );
      bot.sendMessage(msg.chat.id, `Осталось ${total.count}₽`);
    }
  }
  if (msg.text.toLowerCase().match('отдал мне')) {
    const value = msg.text.split(' ').splice(3, 1).join('');
    const user = await User.findOne({
      username: msg.chat.username,
    });
    const targetUser = await User.findOne({
      username: msg.text.split(' ').splice(0, 1).join(''),
    });
    const total = await TotalDebt.findOne({
      from: user._id,
      to: targetUser._id,
    });
    if (value === 'все' || value === 'всё') {
      total.remove();
      bot.sendMessage(msg.chat.id, 'Красава!');
      bot.sendMessage(
        targetUser.telegram_id,
        `Вы погасили долг перед ${user.username}`,
      );
    } else {
      total.count -= +value;
      await total.save();
      bot.sendMessage(
        targetUser.telegram_id,
        `Оставшаяся сумма долга перед ${user.username} составляет ${total.count}₽`,
      );
      bot.sendMessage(msg.chat.id, `Осталось ${total.count}₽`);
    }
  }
});

// bot.sendMessage(82695920, 'Ты понимаешь, что нас ждет через 20 минут?');

// if (msg.text.match(/-\d+|\+\d+/gm)) {
