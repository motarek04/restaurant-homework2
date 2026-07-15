import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import MenuItem from "./models/MenuItem.js";

dotenv.config();

await connectDB();

const menuItems = [
  {
    name: "Classic Burger",
    category: "Burger",
    description:
      "Beef patty with lettuce, tomato, onion, cheese, and house sauce.",
    price: 12.99,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80",
    available: true,
  },
  {
    name: "Chicken Burger",
    category: "Burger",
    description:
      "Grilled chicken breast with lettuce, tomato, and garlic sauce.",
    price: 11.99,
    image:
      "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=900&q=80",
    available: true,
  },
  {
    name: "Margherita Pizza",
    category: "Pizza",
    description:
      "Tomato sauce, mozzarella cheese, and fresh basil.",
    price: 14.99,
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80",
    available: true,
  },
  {
    name: "Pepperoni Pizza",
    category: "Pizza",
    description:
      "Tomato sauce, mozzarella cheese, and pepperoni.",
    price: 16.99,
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=900&q=80",
    available: true,
  },
  {
    name: "Chicken Alfredo",
    category: "Pasta",
    description:
      "Creamy Alfredo pasta served with grilled chicken.",
    price: 15.99,
    image:
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=900&q=80",
    available: true,
  },
  {
    name: "Caesar Salad",
    category: "Salad",
    description:
      "Romaine lettuce, Parmesan cheese, croutons, and Caesar dressing.",
    price: 9.99,
    image:
      "https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=900&q=80",
    available: true,
  },
  {
    name: "Mozzarella Sticks",
    category: "Appetizer",
    description:
      "Fried mozzarella sticks served with marinara sauce.",
    price: 7.99,
    image:
      "https://images.unsplash.com/photo-1548340748-6d2b7d7da280?auto=format&fit=crop&w=900&q=80",
    available: true,
  },
  {
    name: "Chocolate Cake",
    category: "Dessert",
    description:
      "Rich chocolate cake with chocolate frosting.",
    price: 6.99,
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80",
    available: true,
  },
  {
    name: "Soft Drink",
    category: "Drink",
    description:
      "Your choice of fountain soda.",
    price: 2.99,
    image:
      "https://images.unsplash.com/photo-1581636625402-29b2a704ef13?auto=format&fit=crop&w=900&q=80",
    available: true,
  },
];

try {
  await MenuItem.deleteMany();
  await MenuItem.insertMany(menuItems);

  console.log("✅ Menu items added successfully");

  mongoose.connection.close();
} catch (error) {
  console.error(error);
  mongoose.connection.close();
}