require("dotenv").config();
var cors = require('cors')
var express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();



port = process.env.PORT || 3000;

// models
const User = require("./models/User");

// Config JSON response
app.use(express.json());
// Open Route
app.get("/", (req, res) => {
  res.status(200).json({ msg: "Bem vindo a ERROR 404!" });
});

// Private Route
app.get("/user/:id", cors, checkToken, async (req, res) => {
  const id = req.params.id;

  // check if user exists
  const user = await User.findById(id, "-senha");

  if (!user) {
    return res.status(404).json({ msg: "Usuário não encontrado!" });
  }

  res.status(200).json({ user });
});

function checkToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ msg: "Acesso negado!" });

  try {
    const secret = process.env.SECRET;

    jwt.verify(token, secret);

    next();
  } catch (err) {
    res.status(400).json({ msg: "O Token é inválido!" });
  }
}

//app.post("/auth/register", async (req, res) => {
 // const { nome, nomePersonagem, senha} = req.body;

  // validations
  //if (!nome) {
   // return res.status(422).json({ msg: "O nome é obrigatório!" });
 // }

  //if (!nomePersonagem) {
  //  return res.status(422).json({ msg: "O email é obrigatório!" });
  //}

 // if (!senha) {
  //  return res.status(422).json({ msg: "A senha é obrigatória!" });
 // }

  // check if user exists
  //const userExists = await User.findOne({ nomePersonagem: nomePersonagem });

 // if (userExists) {
  //  return res.status(422).json({ msg: "Por favor, utilize outro e-mail!" });
  //}

  // create password
 // const salt = await bcrypt.genSalt(12);
  //const passwordHash = await bcrypt.hash(senha, salt);

  // create user
  //const user = new User({
 //   nome,
  //  nomePersonagem,
 //   senha: passwordHash,
 // });

 // try {
  //  await user.save();

  //  res.status(201).json({ msg: "Usuário criado com sucesso!" });
 // } catch (error) {
  //  res.status(500).json({ msg: error });
 // }
//});

app.post("/auth/login", cors, async (req, res) => {
  const { nomePersonagem, senha } = req.body;

  // validations
  if (!nomePersonagem) {
    return res.status(422).json({ msg: "O nome do personagem é obrigatório!" });
  }

  if (!senha) {
    return res.status(422).json({ msg: "A senha é obrigatória!" });
  }

  // check if user exists
  const user = await User.findOne({ nomePersonagem: nomePersonagem });

  if (!user) {
    return res.status(404).json({ msg: "Usuário não encontrado!" });
  }

  // check if password match
  const checkPassword = await bcrypt.compare(senha, user.senha);

  if (!checkPassword) {
    return res.status(422).json({ msg: "Senha inválida" });
  }

  try {
    const secret = process.env.SECRET;
    const id = user._id
    const token = jwt.sign(
      {
        id: user._id,
      },
      secret
    );

    res.status(200).json({ msg: "Autenticação realizada com sucesso!", token, id});
  } catch (error) {
    res.status(500).json({ msg: "a conexão falhou" });
  }
});

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

mongoose
  .connect(
    `mongodb+srv://${dbUser}:${dbPassword}@cluster0.8sd0nux.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("Conectou ao banco!");
  })
  .catch((err) => console.log(err));
  app.use(cors)
  app.listen(port)