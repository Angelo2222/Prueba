import { useEffect, useState } from 'react';

function App() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('');

  const fetchProducts = async (categoria = '') => {
    try {
      let url = '/productos';
      if (categoria) {
        url += `?categoria=${encodeURIComponent(categoria)}`;
      }
      const response = await fetch(url);
      if (!response.ok) throw new Error('Error al obtener los productos');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFilterChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    fetchProducts(selectedCategory);
  };

  const addToCart = (productId) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find(item => item.id === productId);
    if (existingProduct) {
      existingProduct.cantidad += 1;
    } else {
      cart.push({ id: productId, cantidad: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Producto añadido al carrito');
  };

  return (
    <div>
      <header>
        <h1>Bar - Productos</h1>
        <nav>
          <a href="/">Productos</a>
          <a href="/carrito">Carrito</a>
        </nav>
      </header>

      <main>
        <section id="filters">
          <label htmlFor="category-filter">Filtrar por categoría:</label>
          <select id="category-filter" value={category} onChange={handleFilterChange}>
            <option value="">Todos</option>
            <option value="Electrónica">Electrónica</option>
            <option value="Computadoras">Computadoras</option>
            <option value="Accesorios">Accesorios</option>
            <!-- Agrega más categorías según tus productos -->
          </select>
        </section>

        <section id="product-list">
          {products.length === 0 ? (
            <p>No hay productos disponibles.</p>
          ) : (
            <div className="product-grid">
              {products.map(product => (
                <div key={product.id} className="product-card">
                  <img src={product.imagen} alt={product.nombre} />
                  <h3>{product.nombre}</h3>
                  <p>{product.desc}</p>
                  <p>Precio: ${product.precio.toFixed(2)}</p>
                  <button onClick={() => addToCart(product.id)}>Añadir al Carrito</button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer>
        <p>&copy; 2024 Bar. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default App;
