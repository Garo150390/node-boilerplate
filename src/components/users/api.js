const express = require('express');

const { validateSchema, ajv } = require('../../../lib/validation');
const RS = require('../../../middleware/request');
const Upload = require('../../../lib/uploadFile');
const Auth = require('../../../middleware/auth');
const nconf = require('../../../config');
const usersCtr = require('./service');

const usersUpdateSchema = require('./validate/users-update');
const usersCreateSchema = require('./validate/users');
const loginSchema = require('./validate/login');

const upload = new Upload(nconf.get('storagePaths:users'));

ajv.addSchema(usersUpdateSchema, 'usersUpdate');
ajv.addSchema(usersCreateSchema, 'users');
ajv.addSchema(loginSchema, 'login');

const usersRouter = express.Router();

usersRouter.post('/', upload.single('image'), validateSchema('users'), usersCtr.createUsers);
usersRouter.post('/login', validateSchema('login'), usersCtr.login);

usersRouter.get('/', Auth.permit('admin'), usersCtr.getUsers);
usersRouter.post('/logout', usersCtr.logOut);

usersRouter.get('/:id', RS.equalById('id'), usersCtr.getOneUser);
usersRouter.put('/:id', RS.equalById('id'), upload.single('image'), validateSchema('usersUpdate'), usersCtr.updateUsers);
usersRouter.delete('/:id', RS.equalById('id'), usersCtr.removeUser);

module.exports = usersRouter;
