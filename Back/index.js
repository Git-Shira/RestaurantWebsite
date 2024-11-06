const express = require("express");
const app = express();

const connectDB = require("./db");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const cartRoutes = require('./routes/cart');

app.use(express.json());

const cors = require("cors");

const allowedOrigins = ['https://restaurant-website-gray-gamma.vercel.app'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://restaurant-website-gray-gamma.vercel.app");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

app.options('*', (req, res) => {
    res.header("Access-Control-Allow-Origin", "https://restaurant-website-gray-gamma.vercel.app");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    res.sendStatus(200);
});

connectDB();
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
const PORT = process.env.PORT || 3000;
if (PORT)
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));