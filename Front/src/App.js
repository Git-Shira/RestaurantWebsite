import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { useDispatch } from "react-redux";
import { loadFavoritesFromCookies } from "./redux/favoritesSlice";
import { cartPersistenceMiddleware } from "./redux/cartSlice";

import Progress from "./Progress/Progress";
import Header from "./components/header/Header";
import Home from "../src/pages/home/Home";
import SignUp from "./pages/signup/SignUp";
import SignIn from "./pages/signin/SignIn";
import AdminRoute from "./components/Route/AdminRoute";
import UserRoute from "./components/Route/UserRoute";
import Products from "./pages/products/Products";
import Cart from "./pages/cart/Cart";
import Pay from "./pages/cart/Pay";
import Favorites from "./pages/favorite/Favorites";
import ForgotPassword from "./pages/forgotPassword/ForgotPassword";
import About from "./pages/about/About";
import Branches from "./pages/branches/Branches";

import "./App.css";

import { ThemeProvider, createTheme } from '@mui/material/styles';

function App() {
    const theme = createTheme();

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadFavoritesFromCookies());
    }, [dispatch]);
    useEffect(() => {
        dispatch(cartPersistenceMiddleware());
    }, [dispatch]);

    return (
        <ThemeProvider theme={theme}>
            <Router>
                <Progress />
                <Header />

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/SignUp" element={<SignUp />} />
                    <Route path="/SignIn" element={<SignIn />} />
                    <Route path="/Admin/*" element={<AdminRoute />} />
                    <Route path="/User/*" element={<UserRoute />} />
                    <Route path="/Menu" element={<Products />} />
                    <Route path="/Cart" element={<Cart />} />
                    <Route path="/Pay" element={<Pay />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/forgotPassword" element={<ForgotPassword />} />
                    <Route path="/About" element={<About />} />
                    <Route path="/Branches" element={<Branches />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;