const express = require('express');
const session = require('express-session');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-Parser');
const path =  require('path');
const userRoutes = require('./routes/user.js');

mongoose.connect('mongodb+srv://moussare:moussare1234@cluster0.u4awy.mongodb.net/twitchBotManager?retryWrites=true&w=majority',
{ useNewUrlParser: true,useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !')
);
app.set("views","../frontend/views")
app.set("view engine","ejs")
app.use(express.static("../frontend/ressources"));
app.use(bodyParser.urlencoded())
app.use(session({secret: 'ssshhhhh'}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
app.use(bodyParser.json());
app.use('/',userRoutes);
module.exports = app;