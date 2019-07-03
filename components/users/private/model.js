const { Schema } = require('mongoose');
const crypto = require('crypto');

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
    index: true,
    trim: true,
    minLength: 3,
    maxLength: 90,
  },
  surname: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
  },
  age: {
    required: true,
    type: Number,
  },
  email: {
    type: String,
    email: true,
    unique: true,
    required: true,
  },
  address: {
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
  },
  image: {
    type: String,
    default: 'default_jpg',
  },
  role: {
    type: String,
    enum: ['user', 'editor', 'admin'],
    default: 'user',
  },
  hash: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
  iteration: {
    type: Number,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now(),
  },
});

UserSchema.virtual('password')
  .set(function (data) {
    this.salt = String(Math.random());
    this.iteration = parseInt(Math.random() * 10, 10);
    this.hash = this.getHash(data);
  })
  .get(function () {
    return this.hash;
  });

UserSchema.methods.getHash = function (password) {
  let c = crypto.createHmac('sha1', this.salt);

  for (let i = 0; i < this.iteration; i += 1) {
    c = c.update(password);
  }
  return c.digest('hex');
};

UserSchema.methods.checkPassword = function (data) {
  return this.getHash(data) === this.hash;
};

module.exports = UserSchema;
