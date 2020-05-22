const { Schema } = require('mongoose');
const crypto = require('crypto');

const UserSchema = new Schema({
  created: {
    type: Date,
    default: Date.now,
  },
  deleted: {
    type: Date,
  },
  updated: {
    type: Date,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minLength: 3,
    maxLength: 90,
  },
  surname: {
    type: String,
    trim: true,
  },
  age: {
    type: Number,
  },
  email: {
    type: String,
    email: true,
    unique: true,
    required: true,
  },
  image: {
    type: String,
    default: 'default_jpg',
  },
  subscribe: {
    type: Boolean,
  },
  role: {
    type: String,
    enum: ['user', 'editor', 'admin'],
    default: 'user',
  },
  lang: { type: String },
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
}, {
  toJSON: {
    transform(doc, ret) {
      const {
        hash, salt, iteration, ...jsonRet
      } = ret;
      return jsonRet;
    },
  },
});

UserSchema.virtual('password')
  // eslint-disable-next-line func-names
  .set(function (data) {
    this.salt = String(Math.random());
    this.iteration = parseInt(Math.random() * 10, 10) + 1;
    this.hash = this.getHash(data);
  })
  // eslint-disable-next-line func-names
  .get(function () {
    return this.hash;
  });

// eslint-disable-next-line func-names
UserSchema.methods.getHash = function (password) {
  let c = crypto.createHmac('sha1', this.salt);

  for (let i = 0; i < this.iteration; i += 1) {
    c = c.update(password);
  }
  return c.digest('hex');
};

// eslint-disable-next-line func-names
UserSchema.methods.checkPassword = function (data) {
  return this.getHash(data) === this.hash;
};

module.exports = UserSchema;
