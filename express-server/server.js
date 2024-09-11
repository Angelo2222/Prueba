const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware para parsear el cuerpo de las solicitudes JSON
app.use(express.json());

// Rutas para usuarios
app.get('/usuarios', (req, res) => {
  const usuarios = JSON.parse(fs.readFileSync(path.join(__dirname, 'usuarios.json')));
  res.json(usuarios);
});

app.post('/usuarios', (req, res) => {
  const newUser = req.body;
  const usuarios = JSON.parse(fs.readFileSync(path.join(__dirname, 'usuarios.json')));
  usuarios.push(newUser);
  fs.writeFileSync(path.join(__dirname, 'usuarios.json'), JSON.stringify(usuarios, null, 2));
  res.status(201).json(newUser);
});

app.put('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;
  const usuarios = JSON.parse(fs.readFileSync(path.join(__dirname, 'usuarios.json')));
  const index = usuarios.findIndex(u => u.id === parseInt(id));
  if (index !== -1) {
    usuarios[index] = { ...usuarios[index], ...updatedUser };
    fs.writeFileSync(path.join(__dirname, 'usuarios.json'), JSON.stringify(usuarios, null, 2));
    res.json(usuarios[index]);
  } else {
    res.status(404).json({ message: 'Usuario no encontrado' });
  }
});

app.delete('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  let usuarios = JSON.parse(fs.readFileSync(path.join(__dirname, 'usuarios.json')));
  const ventas = JSON.parse(fs.readFileSync(path.join(__dirname, 'ventas.json')));

  // Verifica si el usuario está relacionado con alguna venta
  const hasSales = ventas.some(v => v.id_usuario === parseInt(id));
  if (hasSales) {
    return res.status(400).json({ message: 'No se puede eliminar el usuario porque está relacionado con una venta.' });
  }

  usuarios = usuarios.filter(u => u.id !== parseInt(id));
  fs.writeFileSync(path.join(__dirname, 'usuarios.json'), JSON.stringify(usuarios, null, 2));
  res.status(204).end();
});

// Rutas para productos
app.get('/productos', (req, res) => {
  const productos = JSON.parse(fs.readFileSync(path.join(__dirname, 'productos.json')));
  res.json(productos);
});

app.post('/productos', (req, res) => {
  const newProduct = req.body;
  const productos = JSON.parse(fs.readFileSync(path.join(__dirname, 'productos.json')));
  productos.push(newProduct);
  fs.writeFileSync(path.join(__dirname, 'productos.json'), JSON.stringify(productos, null, 2));
  res.status(201).json(newProduct);
});

// Ruta para ventas
app.post('/ventas', (req, res) => {
  const newSale = req.body;
  const ventas = JSON.parse(fs.readFileSync(path.join(__dirname, 'ventas.json')));
  ventas.push(newSale);
  fs.writeFileSync(path.join(__dirname, 'ventas.json'), JSON.stringify(ventas, null, 2));
  res.status(201).json(newSale);
});

app.put('/ventas/:id', (req, res) => {
  const { id } = req.params;
  const updatedSale = req.body;
  const ventas = JSON.parse(fs.readFileSync(path.join(__dirname, 'ventas.json')));
  const index = ventas.findIndex(v => v.id === parseInt(id));
  if (index !== -1) {
    ventas[index] = { ...ventas[index], ...updatedSale };
    fs.writeFileSync(path.join(__dirname, 'ventas.json'), JSON.stringify(ventas, null, 2));
    res.json(ventas[index]);
  } else {
    res.status(404).json({ message: 'Venta no encontrada' });
  }
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
