const userConstrains = {
  name: {
    presence: true,
    length: {
      minimum: 2,
      maximum: 30,
    },
  },
  surname: {
    presence: true,
    length: {
      minimum: 2,
      maximum: 30,
    },
  },
  age: {
    presence: true,
  },
  email: {
    presence: true,
    email: true,
    length: {
      minimum: 9,
      maximum: 65,
    },
  },
  password: {
    presence: true,
    length: {
      minimum: 6,
      maximum: 50,
      tooShort: 'needs to have %{count} words or more',
      tooLong: 'needs to have %{count} words or less',
    },
  },
  confirmPassword: {
    presence: true,
    equality: 'password',
  },
  city: {
    presence: true,
  },
  country: {
    presence: true,
  },
  image: {},
};

module.exports = userConstrains;
