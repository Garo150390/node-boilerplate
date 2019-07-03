const express = require('express');
const multer = require('multer');

const users = require('./service');
const Auth = require('../../middleware/auth');
const { equalById } = require('./middleware/users');

const usersRouter = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'public/images/users');
  },
  filename(req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

usersRouter.post('/', upload.single('image'), users.createUsers);
usersRouter.post('/login', users.login);
usersRouter.get('/', Auth.authorizeRequest('admin'), users.getUsers);

usersRouter.use(Auth.authorizeRequest('user'));

usersRouter.get('/:id', equalById, users.getOneUser);
usersRouter.put('/:id', equalById, users.updateUsers);
usersRouter.delete('/:id', equalById, users.removeUsers);

module.exports = usersRouter;
