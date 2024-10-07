document.addEventListener('DOMContentLoaded', () => {
    const cartList = document.getElementById('cart-list');
    const checkoutButton = document.getElementById('checkout');
  
    // Función para obtener productos del carrito desde localStorage
    const getCart = () => JSON.parse(localStorage.getItem('cart')) || [];
  
    // Función para obtener detalles de productos desde el back-end
    const fetchProductDetails = async (productId) => {
      try {
        const response = await fetch(`/productos/${productId}`);
        if (!response.ok) throw new Error('Error al obtener detalles del producto');
        return await response.json();
      } catch (error) {
        console.error(error);
        return null;
      }
    };
  
    // Función para mostrar el carrito
    const displayCart = async () => {
      const cart = getCart();
      if (cart.length === 0) {
        cartList.innerHTML = '<p>Tu carrito está vacío.</p>';
        return;
      }
  
      cartList.innerHTML = '<ul id="cart-items"></ul><p id="total"></p>';
      const cartItems = document.getElementById('cart-items');
      let total = 0;
  
      for (const item of cart) {
        const product = await fetchProductDetails(item.id);
        if (product) {
          const subtotal = product.precio * item.cantidad;
          total += subtotal;
          cartItems.innerHTML += `
            <li>
              <h3>${product.nombre}</h3>
              <p>Precio: $${product.precio.toFixed(2)}</p>
              <p>Cantidad: ${item.cantidad}</p>
              <p>Subtotal: $${subtotal.toFixed(2)}</p>
            </li>
          `;
        }
      }
  
      document.getElementById('total').innerText = `Total: $${total.toFixed(2)}`;
    };
  
    // Función para finalizar la compra
    const checkout = async () => {
      const cart = getCart();
      if (cart.length === 0) {
        alert('Tu carrito está vacío.');
        return;
      }
  
      // Aquí debes obtener el ID del usuario logueado. Por simplicidad, usaremos un ID fijo.
      const userId = 1;
  
      try {
        const response = await fetch('/ventas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id_usuario: userId, productos: cart })
        });
        if (!response.ok) throw new Error('Error al procesar la compra');
        const order = await response.json();
        alert('Compra realizada con éxito');
        localStorage.removeItem('cart');
        displayCart();
      } catch (error) {
        console.error(error);
        alert('Hubo un error al procesar tu compra. Inténtalo nuevamente.');
      }
    };
  
    // Agregar event listener al botón de checkout
    checkoutButton.addEventListener('click', checkout);
  
    // Cargar el carrito al iniciar
    displayCart();
  });
  