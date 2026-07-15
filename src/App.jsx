import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5001";

function App() {
  const [menuItems, setMenuItems] = useState([]);

  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("mosRestaurantCart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [orderMessage, setOrderMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    async function loadMenu() {
      try {
        const response = await fetch(`${API_URL}/api/menu`);

        if (!response.ok) {
          throw new Error("Unable to load the menu.");
        }

        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error(error);
        setOrderMessage("Unable to load the menu.");
      } finally {
        setLoading(false);
      }
    }

    loadMenu();
  }, []);

  useEffect(() => {
    localStorage.setItem("mosRestaurantCart", JSON.stringify(cart));
  }, [cart]);

  function addToCart(item) {
    if (!item.available) {
      setOrderMessage(`${item.name} is currently unavailable.`);
      return;
    }

    setOrderMessage("");

    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (cartItem) => cartItem._id === item._id
      );

      if (existingItem) {
        return currentCart.map((cartItem) =>
          cartItem._id === item._id
            ? {
                ...cartItem,
                quantity: cartItem.quantity + 1,
              }
            : cartItem
        );
      }

      return [...currentCart, { ...item, quantity: 1 }];
    });
  }

  function increaseQuantity(id) {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item._id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  }

  function decreaseQuantity(id) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item._id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(id) {
    setCart((currentCart) =>
      currentCart.filter((item) => item._id !== id)
    );
  }

  function clearCart() {
    setCart([]);
    setOrderMessage("");
  }

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const categories = [
    "All",
    ...new Set(menuItems.map((item) => item.category)),
  ];

  const filteredMenuItems = menuItems.filter((item) => {
    const searchValue = searchTerm.toLowerCase().trim();

    const matchesSearch =
      item.name.toLowerCase().includes(searchValue) ||
      item.description.toLowerCase().includes(searchValue);

    const matchesCategory =
      selectedCategory === "All" ||
      item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  async function placeOrder(event) {
    event.preventDefault();
    setOrderMessage("");

    if (!customerName.trim() || !customerEmail.trim()) {
      setOrderMessage("Please enter your name and email.");
      return;
    }

    if (cart.length === 0) {
      setOrderMessage("Your cart is empty.");
      return;
    }

    const orderData = {
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      items: cart.map((item) => ({
        menuItem: item._id,
        name: item.name,
        price: Number(item.price),
        quantity: item.quantity,
      })),
      total: Number(total.toFixed(2)),
    };

    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Unable to place the order."
        );
      }

      setOrderMessage("Order placed successfully!");
      setCart([]);
      setCustomerName("");
      setCustomerEmail("");
    } catch (error) {
      setOrderMessage(error.message);
    }
  }

  return (
    <div>
      <nav className="navbar">
        <h2>Mo&apos;s Restaurant</h2>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#menu">Menu</a>
          <a href="#gallery">Gallery</a>
          <a href="#about">About</a>
          <a href="#cart">Cart ({cartCount})</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <header id="home" className="hero">
        <h1>🍽️ Mo&apos;s Restaurant</h1>
        <p>Fresh Food • Great Taste • Fast Service</p>

        <a href="#menu" className="hero-btn">
          Order Now
        </a>
      </header>

      <section id="menu" className="section">
        <h2>Our Menu</h2>

        <div className="menu-controls">
          <input
            type="text"
            placeholder="Search menu..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />

          <div className="category-filters">
            {categories.map((category) => (
              <button
                type="button"
                key={category}
                className={
                  selectedCategory === category
                    ? "active-filter"
                    : ""
                }
                onClick={() =>
                  setSelectedCategory(category)
                }
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p>Loading menu...</p>
        ) : filteredMenuItems.length === 0 ? (
          <p>No menu items match your search.</p>
        ) : (
          <div className="cards">
            {filteredMenuItems.map((item) => (
              <div className="card" key={item._id}>
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                  />
                )}

                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <h4>
                  ${Number(item.price).toFixed(2)}
                </h4>

                <button
                  type="button"
                  onClick={() => addToCart(item)}
                  disabled={!item.available}
                >
                  {item.available
                    ? "Add to Cart"
                    : "Unavailable"}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section id="gallery" className="section dark">
        <h2>Food Gallery</h2>

        <div className="slider">
          {menuItems
            .filter((item) => item.image)
            .map((item) => (
              <img
                key={item._id}
                src={item.image}
                alt={item.name}
              />
            ))}
        </div>
      </section>

      <section id="about" className="section">
        <h2>About Us</h2>

        <p className="about-text">
          Mo&apos;s Restaurant was created to serve fresh and
          tasty meals in a welcoming place. Our menu includes
          burgers, pizza, pasta, salads, desserts, drinks, and
          more. We believe good food brings people together.
        </p>
      </section>

      <section
        id="cart"
        className="section cart-section"
      >
        <h2>Shopping Cart</h2>

        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            {cart.map((item) => (
              <div
                className="cart-item"
                key={item._id}
              >
                <div>
                  <strong>{item.name}</strong>

                  <p>
                    $
                    {(
                      Number(item.price) *
                      item.quantity
                    ).toFixed(2)}
                  </p>
                </div>

                <div className="quantity-controls">
                  <button
                    type="button"
                    onClick={() =>
                      decreaseQuantity(item._id)
                    }
                  >
                    −
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    type="button"
                    onClick={() =>
                      increaseQuantity(item._id)
                    }
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    removeFromCart(item._id)
                  }
                >
                  Remove
                </button>
              </div>
            ))}

            <h3>Total: ${total.toFixed(2)}</h3>

            <form
              className="checkout-form"
              onSubmit={placeOrder}
            >
              <input
                type="text"
                placeholder="Customer name"
                value={customerName}
                onChange={(event) =>
                  setCustomerName(event.target.value)
                }
                required
              />

              <input
                type="email"
                placeholder="Customer email"
                value={customerEmail}
                onChange={(event) =>
                  setCustomerEmail(event.target.value)
                }
                required
              />

              <button type="submit">
                Place Order
              </button>
            </form>

            <button
              type="button"
              className="clear-btn"
              onClick={clearCart}
            >
              Clear Cart
            </button>
          </>
        )}

        {orderMessage && (
          <p className="order-message">
            {orderMessage}
          </p>
        )}
      </section>

      <section
        id="contact"
        className="section contact"
      >
        <h2>Contact Us</h2>

        <div className="contact-box">
          <form
            onSubmit={(event) =>
              event.preventDefault()
            }
          >
            <input
              type="text"
              placeholder="Name"
            />

            <input
              type="email"
              placeholder="Email"
            />

            <textarea placeholder="Message"></textarea>

            <button type="submit">
              Send Message
            </button>
          </form>

          <iframe
            title="Google Map"
            src="https://www.google.com/maps?q=New%20York%20City&output=embed"
          ></iframe>
        </div>
      </section>

      <footer>
        <h3>Mo&apos;s Restaurant</h3>
        <p>
          Hours: Monday - Sunday | 10 AM - 10 PM
        </p>
        <p>Facebook | Instagram | TikTok</p>
        <p>© 2026 Mo&apos;s Restaurant</p>
      </footer>
    </div>
  );
}

export default App;