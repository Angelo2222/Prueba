import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const ventasFilePath = path.join(__dirname, '../data/ventas.json');
const usuariosFilePath = path.join(__dirname, '../data/usuarios.json');

// Leer datos del archivo JSON
const readDataFromFile = (filePath) => {
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
};

// Ruta POST para crear una nueva venta (orden de compra)
router.post('/', (req, res) => {
  try {
    const { id_usuario, productos } = req.body;

    // Validar que el usuario existe
    const usuarios = readDataFromFile(usuariosFilePath);
    const usuario = usuarios.find(u => u.id === id_usuario);
    if (!usuario) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    // Validar que los productos existen y obtener sus detalles
    const productosData = readDataFromFile(path.join(__dirname, '../data/productos.json'));
    const productosVendidos = productos.map(item => {
      const producto = productosData.find(p => p.id === item.id);
      if (!producto) {
        throw new Error(`Producto con ID ${item.id} no encontrado`);
      }
      return { ...producto, cantidad: item.cantidad };
    });

    // Crear la nueva venta
    const ventas = readDataFromFile(ventasFilePath);
    const newSale = {
      id: ventas.length ? ventas[ventas.length - 1].id + 1 : 1,
      id_usuario,
      fecha: new Date().toISOString().split('T')[0],
      total: productosVendidos.reduce((acc, item) => acc + item.precio * item.cantidad, 0),
      dirección: usuario.dirección || 'No especificada',
      productos: productosVendidos
    };

    ventas.push(newSale);
    fs.writeFileSync(ventasFilePath, JSON.stringify(ventas, null, 2));

    res.status(201).json(newSale);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Error al procesar la compra' });
  }
});

export default router;
