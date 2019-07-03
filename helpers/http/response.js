const status = Object.freeze({
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  INTERNAL_SERVER_ERROR: 500,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  PRECONDITION_FAILED: 412,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
});

const dispatch = (obj) => {
  const defaults = {
    success: true,
    data: {},
    error: null,
    set error(value) {
      this.success = false;
    },
  };

  return {
    ...defaults,
    ...obj,
  };
};

module.exports = {
  dispatch,
  status,
};
