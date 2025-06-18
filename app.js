import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import router from './routes/routes.js';
import session from 'express-session';

const app=express();
const PORT = process.env.PORT || 3000;

app.use(session({
  secret: 'FabricioZalazar123456789Aeio',  
  resave: false,                      
  saveUninitialized: false            
}));

app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views')); 
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', router);

app.get('/', (req, res) => {
  if (!req.session.usuario) {
    return res.render('login');
  }
  res.render('perfil', { usuario: req.session.usuario });
});

app.get('/perfil', (req, res) => {
  if (!req.session.usuario) {
    return res.render('login');
  }
  res.render('perfil', { usuario: req.session.usuario });
});

app.get('/login', (req, res) => {
 res.render('login', { title: 'Login - Artesanos.com' });
});

app.get('/registro', (req, res) => {
 res.render('registro', { title: 'Registro - Artesanos.com' });
});

app.get('/crear', (req, res) => {
 res.render('registro', { title: 'Registro - Artesanos.com' });
});


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});