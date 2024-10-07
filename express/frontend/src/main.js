document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const categoryFilter = document.getElementById('category-filter');
  
    // Función para obtener productos del back-end
    const fetchProducts = async (category = '') => {
      try {
        let url = '/productos';
        if (category) {
          url += `?categoria=${encodeURIComponent(category)}`;
        }
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error al obtener los productos');
        const products = await response.json();
        displayProducts(products);
      } catch (error) {
        console.error(error);
        productList.innerHTML = '<p>Error al cargar los productos.</p>';
      }
    };
  
    // Función para mostrar productos en la página
    const displayProducts = (products) => {
      productList.innerHTML = '';
      if (products.length === 0) {
        productList.innerHTML = '<p>No hay productos disponibles.</p>';
        return;
      }
      products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
          <img src="${product.imagen}" alt="${product.nombre}">
          <h3>${product.nombre}</h3>
          <p>${product.desc}</p>
          <p>Precio: $${product.precio.toFixed(2)}</p>
          <button data-product-id="${product.id}">Añadir al Carrito</button>
        `;
        productList.appendChild(productCard);
      });
  
      // Agregar event listeners a los botones de añadir al carrito
      document.querySelectorAll('button[data-product-id]').forEach(button => {
        button.addEventListener('click', () => {
          const productId = parseInt(button.getAttribute('data-product-id'));
          addToCart(productId);
        });
      });
    };
  
    // Función para añadir un producto al carrito en localStorage
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
  
    // Manejar el filtro de categoría
    categoryFilter.addEventListener('change', () => {
      const selectedCategory = categoryFilter.value;
      fetchProducts(selectedCategory);
    });
  
    // Cargar productos al iniciar
    fetchProducts();
    
  });
  