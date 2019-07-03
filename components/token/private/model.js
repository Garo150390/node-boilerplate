const mongoose = require('mongoose');

const { Schema } = mongoose;

const TokenSchema = new Schema({
  userId: {
    type: mongoose.ObjectId,
    ref: 'Users',
    required: true,
  },
  tokenId: {
    type: String,
    required: true,
  },
});

module.exports = TokenSchema;
