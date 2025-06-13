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

app.get('/', (req, res) => {
 res.sendFile(path.join(__dirname, 'public/login.html'));
});

app.use(express.static(path.join(__dirname, 'public')));




app.use('/', router);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});