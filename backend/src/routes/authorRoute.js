const express = require('express');
const AuthorController = require('../controllers/authorController');
const route = express.Router();

route
    .post('/', AuthorController.create)
    .get('/', AuthorController.getAll)

module.exports = route;