import { useEffect, useState } from "react";
import "./Admin.css";

const API_URL = "https://restaurant-homework2.onrender.com";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80";

const EMPTY_FORM = {
  name: "",
  category: "Burger",
  description: "",
  price: "",
  image: "",
  available: true,
};

function Admin() {
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);

  async function loadOrders() {
    try {
      const response = await fetch(`${API_URL}/api/orders`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load orders.");
      }

      setOrders(data);
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function loadMenuItems() {
    try {
      const response = await fetch(`${API_URL}/api/menu`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load menu items.");
      }

      setMenuItems(data);
    } catch (error) {
      setMessage(error.message);
    }
  }

  useEffect(() => {
    loadOrders();
    loadMenuItems();
  }, []);

  const totalRevenue = orders
    .filter((order) => order.status !== "Cancelled")
    .reduce((sum, order) => sum + Number(order.total), 0);

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const completedOrders = orders.filter(
    (order) => order.status === "Completed"
  ).length;

  const cancelledOrders = orders.filter(
    (order) => order.status === "Cancelled"
  ).length;

  const itemCounts = {};

  orders.forEach((order) => {
    order.items.forEach((item) => {
      itemCounts[item.name] =
        (itemCounts[item.name] || 0) + item.quantity;
    });
  });

  const mostOrderedItem =
    Object.entries(itemCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "No orders yet";

  async function handleMenuSubmit(event) {
    event.preventDefault();
    setMessage("");

    const menuData = {
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
      image: form.image.trim(),
      price: Number(form.price),
    };

    try {
      const url = editingId
        ? `${API_URL}/api/menu/${editingId}`
        : `${API_URL}/api/menu`;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(menuData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            `Unable to ${editingId ? "update" : "add"} menu item.`
        );
      }

      setMessage(
        editingId
          ? "Menu item updated successfully."
          : "Menu item added successfully."
      );

      setForm(EMPTY_FORM);
      setEditingId(null);
      await loadMenuItems();
    } catch (error) {
      setMessage(error.message);
    }
  }

  function startEditing(item) {
    setEditingId(item._id);

    setForm({
      name: item.name,
      category: item.category,
      description: item.description,
      price: item.price,
      image: item.image || "",
      available: item.available,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function cancelEditing() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setMessage("Editing cancelled.");
  }

  async function deleteMenuItem(menuItemId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this menu item?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/menu/${menuItemId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete menu item.");
      }

      setMessage("Menu item deleted.");
      await loadMenuItems();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function updateOrderStatus(orderId, status) {
    try {
      const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update order.");
      }

      setMessage("Order status updated.");
      await loadOrders();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function deleteOrder(orderId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete order.");
      }

      setMessage("Order deleted.");
      await loadOrders();
    } catch (error) {
      setMessage(error.message);
    }
  }

  function handleImageError(event) {
    event.currentTarget.onerror = null;
    event.currentTarget.src = FALLBACK_IMAGE;
  }

  return (
    <div className="admin-page">
      <h1>Mo&apos;s Restaurant Admin Dashboard</h1>

      {message && <p className="admin-message">{message}</p>}

      <section className="dashboard-stats">
        <div className="stat-card">
          <span className="stat-icon">🍽️</span>
          <div>
            <p>Menu Items</p>
            <h2>{menuItems.length}</h2>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">📦</span>
          <div>
            <p>Total Orders</p>
            <h2>{orders.length}</h2>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">💰</span>
          <div>
            <p>Total Revenue</p>
            <h2>${totalRevenue.toFixed(2)}</h2>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">⏳</span>
          <div>
            <p>Pending Orders</p>
            <h2>{pendingOrders}</h2>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">✅</span>
          <div>
            <p>Completed Orders</p>
            <h2>{completedOrders}</h2>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">❌</span>
          <div>
            <p>Cancelled Orders</p>
            <h2>{cancelledOrders}</h2>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">🔥</span>
          <div>
            <p>Most Ordered Item</p>
            <h2 className="best-seller-name">{mostOrderedItem}</h2>
          </div>
        </div>
      </section>

      <section className="admin-section">
        <h2>{editingId ? "Edit Menu Item" : "Add Menu Item"}</h2>

        <form className="admin-form" onSubmit={handleMenuSubmit}>
          <input
            type="text"
            placeholder="Item name"
            value={form.name}
            onChange={(event) =>
              setForm({ ...form, name: event.target.value })
            }
            required
          />

          <select
            value={form.category}
            onChange={(event) =>
              setForm({ ...form, category: event.target.value })
            }
          >
            <option value="Appetizer">Appetizer</option>
            <option value="Burger">Burger</option>
            <option value="Pizza">Pizza</option>
            <option value="Pasta">Pasta</option>
            <option value="Salad">Salad</option>
            <option value="Dessert">Dessert</option>
            <option value="Drink">Drink</option>
          </select>

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(event) =>
              setForm({ ...form, description: event.target.value })
            }
            required
          />

          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="Price"
            value={form.price}
            onChange={(event) =>
              setForm({ ...form, price: event.target.value })
            }
            required
          />

          <input
            type="url"
            placeholder="Image URL"
            value={form.image}
            onChange={(event) =>
              setForm({ ...form, image: event.target.value })
            }
          />

          {form.image && (
            <img
              className="admin-image-preview"
              src={form.image}
              alt="Menu item preview"
              onError={handleImageError}
            />
          )}

          <label className="availability-row">
            <input
              type="checkbox"
              checked={form.available}
              onChange={(event) =>
                setForm({ ...form, available: event.target.checked })
              }
            />
            Available
          </label>

          <div className="admin-form-actions">
            <button type="submit">
              {editingId ? "Save Changes" : "Add Menu Item"}
            </button>

            {editingId && (
              <button
                type="button"
                className="cancel-button"
                onClick={cancelEditing}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="admin-section">
        <h2>Menu Management</h2>

        <div className="admin-grid">
          {menuItems.map((item) => (
            <div className="admin-card" key={item._id}>
              <img
                className="admin-card-image"
                src={item.image || FALLBACK_IMAGE}
                alt={item.name}
                onError={handleImageError}
              />

              <h3>{item.name}</h3>
              <p>{item.category}</p>
              <p>{item.description}</p>
              <strong>${Number(item.price).toFixed(2)}</strong>
              <p>{item.available ? "Available" : "Unavailable"}</p>

              <div className="menu-card-actions">
                <button
                  type="button"
                  className="edit-button"
                  onClick={() => startEditing(item)}
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="delete-button"
                  onClick={() => deleteMenuItem(item._id)}
                >
                  Delete Item
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-section">
        <h2>Orders</h2>

        {orders.length === 0 ? (
          <p>No orders have been placed yet.</p>
        ) : (
          <div className="admin-grid">
            {orders.map((order) => (
              <div className="admin-card" key={order._id}>
                <h3>{order.customerName}</h3>
                <p>{order.customerEmail}</p>

                <div className="admin-order-items">
                  {order.items.map((item, index) => (
                    <p key={`${order._id}-${index}`}>
                      {item.name} × {item.quantity}
                    </p>
                  ))}
                </div>

                <strong>Total: ${Number(order.total).toFixed(2)}</strong>

                <select
                  value={order.status}
                  onChange={(event) =>
                    updateOrderStatus(order._id, event.target.value)
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Ready">Ready</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <button
                  type="button"
                  className="delete-button"
                  onClick={() => deleteOrder(order._id)}
                >
                  Delete Order
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Admin;