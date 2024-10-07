import express from 'express';
import cors from 'cors';
import usuariosRoutes from './routes/usuarios.js';
import productosRoutes from './routes/productos.js';
import ventasRoutes from './routes/ventas.js';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Permite solicitudes desde cualquier origen
app.use(express.json());

// Rutas
app.use('/usuarios', usuariosRoutes);
app.use('/productos', productosRoutes);
app.use('/ventas', ventasRoutes);

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
