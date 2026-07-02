import { useState } from "react";
import "./App.css";

const menuItems = [
  { id: 1, name: "Classic Burger", price: 10.99, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd", desc: "Juicy beef burger with cheese and fries." },
  { id: 2, name: "Pepperoni Pizza", price: 14.99, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591", desc: "Fresh mozzarella with pepperoni." },
  { id: 3, name: "Alfredo Pasta", price: 12.99, image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9", desc: "Creamy pasta with parmesan sauce." },
  { id: 4, name: "Grilled Salmon", price: 18.99, image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288", desc: "Fresh salmon with rice and vegetables." },
  { id: 5, name: "Steak Plate", price: 21.99, image: "https://images.unsplash.com/photo-1558030006-450675393462", desc: "Tender steak served with potatoes." },
  { id: 6, name: "Shrimp Tacos", price: 13.99, image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b", desc: "Shrimp tacos with fresh toppings." },
];

function App() {
  const [cart, setCart] = useState([]);

  function addToCart(item) {
    const found = cart.find((cartItem) => cartItem.id === item.id);

    if (found) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  }

  function removeFromCart(id) {
    setCart(cart.filter((item) => item.id !== id));
  }

  function clearCart() {
    setCart([]);
  }

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div>
      <nav className="navbar">
        <h2>Mo's Restaurant</h2>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#menu">Menu</a>
          <a href="#gallery">Gallery</a>
          <a href="#about">About</a>
          <a href="#cart">Cart ({cart.length})</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <header id="home" className="hero">
        <h1>🍽️ Mo's Restaurant</h1>
        <p>Fresh Food • Great Taste • Fast Service</p>
        <a href="#menu" className="hero-btn">Order Now</a>
      </header>

      <section id="menu" className="section">
        <h2>Our Menu</h2>

        <div className="cards">
          {menuItems.map((item) => (
            <div className="card" key={item.id}>
              <img src={item.image} alt={item.name} />
              <h3>{item.name}</h3>
              <p>{item.desc}</p>
              <h4>${item.price.toFixed(2)}</h4>
              <button onClick={() => addToCart(item)}>Add to Cart</button>
            </div>
          ))}
        </div>
      </section>

      <section id="gallery" className="section dark">
        <h2>Food Gallery</h2>

        <div className="slider">
          {menuItems.map((item) => (
            <img key={item.id} src={item.image} alt={item.name} />
          ))}
        </div>
      </section>

      <section id="about" className="section">
        <h2>About Us</h2>
        <p className="about-text">
          Mo's Restaurant was created to serve fresh and tasty meals in a
          welcoming place. Our menu includes burgers, pizza, pasta, seafood,
          steak, and more. We believe good food brings people together.
        </p>
      </section>

      <section id="cart" className="section cart-section">
        <h2>Shopping Cart</h2>

        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            {cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <span>{item.name} x {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
                <button onClick={() => removeFromCart(item.id)}>Remove</button>
              </div>
            ))}

            <h3>Total: ${total.toFixed(2)}</h3>

            <button className="clear-btn" onClick={clearCart}>
              Clear Cart
            </button>
          </>
        )}
      </section>

      <section id="contact" className="section contact">
        <h2>Contact Us</h2>

        <div className="contact-box">
          <form>
            <input type="text" placeholder="Name" />
            <input type="email" placeholder="Email" />
            <textarea placeholder="Message"></textarea>
            <button type="submit">Send Message</button>
          </form>

          <iframe
            title="Google Map"
            src="https://www.google.com/maps?q=New%20York%20City&output=embed"
          ></iframe>
        </div>
      </section>

      <footer>
        <h3>Mo's Restaurant</h3>
        <p>Hours: Monday - Sunday | 10 AM - 10 PM</p>
        <p>Facebook | Instagram | TikTok</p>
        <p>© 2026 Mo's Restaurant</p>
      </footer>
    </div>
  );
}

export default App;