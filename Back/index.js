const express = require("express");
const app = express();

const connectDB = require("./db");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const cartRoutes = require('./routes/cart');

app.use(express.json());

const cors = require("cors");
app.use(cors({
    origin: '*',
    credentials: true
}));

app.options('*', cors());

connectDB();
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
const PORT = process.env.PORT || 3000;
if (PORT)
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));