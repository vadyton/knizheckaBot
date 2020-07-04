import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const totalDebtSchema = new Schema({
  count: Number,
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

export default model('TotalDebt', totalDebtSchema);
