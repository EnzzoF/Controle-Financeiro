const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const port = 5500;

app.use(express.static(path.join(__dirname, 'public')));

// Configuração do mecanismo de visualização
app.set('view engine', 'ejs');

// Configuração das chaves do Google
const CLIENT_ID = '942019402445-5np9nuvtksspc5dkbm65bhlejila591n.apps.googleusercontent.com';
const CLIENT_SECRET = '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';

// Configuração da estratégia de autenticação do Google
passport.use(new GoogleStrategy({
  clientID: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
  // Lógica para lidar com o perfil do usuário retornado pelo Google
  done(null, profile);
}));

// Configuração de sessão
app.use(session({
  secret: 'segredo',
  resave: false,
  saveUninitialized: false,
}));

// Inicialização do Passport e sessão
app.use(passport.initialize());
app.use(passport.session());

// Serialização e desserialização do usuário
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Rota de login com o botão do Google
app.get('/', (req, res) => {
  res.render('login');
});

// Rota para iniciar a autenticação com o Google
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Rota para receber o callback do Google após a autenticação
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  // Redireciona para a rota desejada após a autenticação bem-sucedida
  res.redirect('/dashboard');
});

// Rota de dashboard para exibir os dados do usuário autenticado
app.get('/dashboard', (req, res) => {
    if (req.isAuthenticated()) {
      const user = req.user;
      res.render('dashboard', { user });
    } else {
      res.render('login');
    }
  });
  
// Rota de logout
app.get('/logout', (req, res) => {
    console.log('Usuario Desconectado:', req.user.name);
    req.logout(function(err) {
      if (err) {
        console.error(err);
      }
      res.render('login');
    });
  });
  

// Inicialização do servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
