'use strict'
const mongoose = require('mongoose')

const User = mongoose.model('User', {
  nome: String,
  nomePersonagem: String,
  senha: String,
})

module.exports = User
