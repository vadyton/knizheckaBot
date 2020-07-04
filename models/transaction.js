import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const transactionSchema = new Schema({
  count: Number,
  comment: String,
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createAt: {
    type: Date,
    default: new Date(),
  },
});

export default model('Transaction', transactionSchema);
