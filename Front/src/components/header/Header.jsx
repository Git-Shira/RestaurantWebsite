import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { List } from "@mui/material";
import { ListItem } from "@mui/material";
import { ListItemText } from "@mui/material";
import { Popover } from "@mui/material";
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

import { useDispatch } from "react-redux";
import { logout } from "../../redux/userSlice";

import logo from "./logo.png";

import "./Header.css";

const Header = () => {
    const [isLogin, setIsLogin] = React.useState(false);
    const [lengthFavorite, setLengthFavorite] = React.useState([]);
    const [admin, setAdmin] = React.useState(false);

    const [anchorEl, setAnchorEl] = useState(null); // State for the Popover
    // const [anchorElFavorite, setAnchorElFavorite] = useState(null); // State for the Popover
    // const [favoriteLeght, setFavoriteLeght] = useState(0);
    // const [permissions, setPermissions] = useState([]); // State for the Popover
    // const [dataFavorite, setDataFavorite] = useState([]);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [cartLength, setCartLength] = useState([]);
    const dispatch = useDispatch();
    const userConnected = useSelector((state) => state.user.isAuthenticating);
    const favorites = useSelector((state) => state.favorites.favorites);
    const cart = useSelector((state) => state.cart);
    const user = useSelector((state) => state.user.user);
    const userCookies = Cookies.get("user");
    const cartCookies = Cookies.get("cart");
    const cartFromCookies = Cookies.get("favorites");
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (cartCookies) {
            setCartLength(JSON.parse(cartCookies));
        }
    }, [cartCookies]);

    useEffect(() => {
        if (cartFromCookies) {
            setLengthFavorite(JSON.parse(cartFromCookies));
        }
    }, [cartFromCookies]);

    // useEffect(() => {
    // console.log(cartCookies);
    // setFavoriteLeght(favorites.length);
    // setDataFavorite(favorites);
    // }, [favorites]);

    const handleLogout = () => {
        dispatch(logout()); // Dispatch the logout action
        localStorage.removeItem("user");
        Cookies.remove("user", { path: "/" }); // Clear the user cookie
        Cookies.remove("cart", { path: "/" });
        Cookies.remove("favorites", { path: "/" });

        navigate("/");
        // Refresh the page
        window.location.reload();
    };

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget); // Open the Popover
    };
    const handleMenuClose = () => {
        setAnchorEl(null); // Close the Popover
    };

    const handleMenuClickFavorite = (event) => {
        if (isPopoverOpen) {
            // Close the popover if it's open
            setIsPopoverOpen(false);
        } else {
            // Open the popover
            // setAnchorElFavorite(event.currentTarget);
            setIsPopoverOpen(true);
        }
    };

    useEffect(() => {
        if (userCookies) {
            const parsedCookies = JSON.parse(userCookies); // Ensure this parsing is correct
            setIsLogin(true);

            // setPermissions(parsedCookies.permission); // Set permissions correctly after parsing

            if (parsedCookies.permission === "admin") {
                // Direct comparison without JSON.stringify
                setAdmin(true);
            }
        }
    }, [userCookies]);

    console.log(lengthFavorite.length);

    const [anchorElNav, setAnchorElNav] = React.useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    return (
        <Box
            className="header"
        >
            <AppBar position="fixed" sx={{ background: "black" }}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="#app-bar-with-responsive-menu"
                            sx={{
                                mr: -3.5,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            <Link to={"/"}>
                                <img src={logo} alt="" />
                            </Link>
                        </Typography>

                        <Box sx={{
                            flexGrow: 1, display: { xs: 'flex', md: 'none' }
                        }}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                                sx={{ '& .MuiSvgIcon-root': { fontSize: 32, color: "white" } }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{
                                    display: { xs: 'block', md: 'none' }}}
                            >
                                <MenuItem onClick={handleCloseNavMenu}>
                                    <ListItem button component={Link} to="/" sx={{
                                        textAlign: "center", border: location.pathname === '/' ? '2px solid #C1121F' : 'none'}}>
                                        <ListItemText primary="בית" />
                                    </ListItem>
                                </MenuItem>
                                <MenuItem onClick={handleCloseNavMenu}>
                                    <ListItem button component={Link} to="/Menu" sx={{
                                        textAlign: "center", border: location.pathname === '/Menu' ? '2px solid #C1121F' : 'none'}}>
                                        <ListItemText primary="תפריט" />
                                    </ListItem>
                                </MenuItem>
                                <MenuItem onClick={handleCloseNavMenu}>
                                    <ListItem button component={Link} to="/Cart" sx={{
                                        textAlign: "center", border: location.pathname === '/Cart' ? '2px solid #C1121F' : 'none'
                                    }}>
                                        <ListItemText primary="סל קניות" />
                                    </ListItem>
                                    {cartLength.length > 0 && (
                                        <Box
                                            sx={{
                                                position: "absolute",
                                                top: 7.8,
                                                bgcolor: "#C1121F",
                                                color: "white",
                                                fontSize: "10px",
                                                width: "18px",
                                                height: "18px",
                                                borderRadius: "50%",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                marginRight: 8.7
                                            }}
                                        >
                                            {cartLength.length}
                                        </Box>
                                    )}
                                </MenuItem>
                                <MenuItem onClick={handleCloseNavMenu}>
                                    <ListItem button component={Link} to="/Branches" sx={{
                                        textAlign: "center", border: location.pathname === '/Branches' ? '2px solid #C1121F' : 'none'}}>
                                        <ListItemText primary="סניפים" />
                                    </ListItem>
                                </MenuItem>
                                <MenuItem onClick={handleCloseNavMenu}>
                                    <ListItem button component={Link} to="/About" sx={{
                                        textAlign: "center", border: location.pathname === '/About' ? '2px solid #C1121F' : 'none'}}>
                                        <ListItemText primary="אודותינו" />
                                    </ListItem>
                                </MenuItem>
                            </Menu>
                        </Box>
                        <Typography
                            variant="h5"
                            noWrap
                            component="a"
                            href="#app-bar-with-responsive-menu"
                            sx={{
                                mr: 1,
                                display: { xs: 'flex', md: 'none' },
                                flexGrow: 1,
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            {/* LOGO */}
                            <Link to={"/"}>
                                <img src={logo} alt=""
                                // sx={{ marginRight: -20, marginTop: 5 }} 
                                />
                            </Link>
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            {/* {pages.map((page) => (
                                <Button
                                    key={page}
                                    onClick={handleCloseNavMenu}
                                    sx={{ my: 2, color: 'white', display: 'block' }}
                                >
                                    {page}
                                </Button>
                            ))} */}
                            <Typography variant="h6" component="div" className="nav" sx={{ flexGrow: 0, marginRight: 0.5 }}>
                                <Link to={"/"} className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>בית</Link>
                            </Typography>
                            <Typography variant="h6" component="div" className="nav" sx={{ flexGrow: 0, marginRight: 0.5 }}>
                                <Link to={"/Menu"} className={`nav-link ${location.pathname === '/Menu' ? 'active' : ''}`}>תפריט</Link>
                            </Typography>
                            <Typography variant="h6" component="div" className="nav" sx={{ flexGrow: 0, marginRight: 0.5 }}>
                                <Link to={"/Cart"} className={`nav-link ${location.pathname === '/Cart' ? 'active' : ''}`}>
                                    סל קניות
                                    {cartLength.length > 0 && (
                                        <Box
                                            sx={{
                                                position: "absolute",
                                                top: 18,
                                                bgcolor: "#C1121F",
                                                color: "white",
                                                fontSize: "10px",
                                                width: "20px",
                                                height: "20px",
                                                borderRadius: "50%",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                marginRight: 9
                                            }}
                                        >
                                            {cartLength.length}
                                        </Box>
                                    )}
                                </Link>
                            </Typography>
                            <Typography variant="h6" component="div" className="nav" sx={{ flexGrow: 0, marginRight: 0.5 }}>
                                <Link to={"/Branches"} className={`nav-link ${location.pathname === '/Branches' ? 'active' : ''}`}>סניפים</Link>
                            </Typography>
                            <Typography variant="h6" component="div" className="nav" sx={{ flexGrow: 0, marginRight: 0.5 }}>
                                <Link to={"/About"} className={`nav-link ${location.pathname === '/About' ? 'active' : ''}`}>אודותינו</Link>
                            </Typography>
                        </Box>

                        <Box sx={{ flexGrow: 0 }}>
                            {isLogin ? (
                                <>
                                    <Link to={"/favorites"}>
                                        <IconButton
                                            color="inherit"
                                            aria-haspopup="true"
                                            onClick={handleMenuClickFavorite}
                                            sx={{ marginRight: -10, flex: 10, '& .MuiSvgIcon-root': { fontSize: 32, color: "white" } }}
                                        >
                                            {/* <FavoriteIcon /> */}
                                            <FavoriteBorderOutlinedIcon />

                                            {lengthFavorite.length > 0 && (
                                                <Box
                                                    sx={{
                                                        position: "absolute",
                                                        top: -1,
                                                        bgcolor: "#C1121F",
                                                        color: "white",
                                                        fontSize: "10px",
                                                        width: "20px",
                                                        height: "20px",
                                                        borderRadius: "50%",
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        marginRight: 4
                                                    }}
                                                >
                                                    {lengthFavorite.length}
                                                    {/* {favorites.length} */}
                                                </Box>
                                            )}
                                        </IconButton>
                                    </Link>

                                    <IconButton
                                        color="inherit"
                                        aria-haspopup="true"
                                        onClick={handleMenuClick}
                                        sx={{ marginRight: 1.5, '& .MuiSvgIcon-root': { fontSize: 32 } }}
                                    >
                                        <AccountCircleOutlinedIcon />
                                    </IconButton>

                                    {admin ? (
                                        <Popover
                                            open={Boolean(anchorEl)}
                                            anchorEl={anchorEl}
                                            onClose={handleMenuClose}
                                            sx={{ marginTop: 3.5, marginLeft: 3.5 }}
                                        >
                                            <List>
                                                <ListItem button component={Link} to="/Admin/Management" sx={{ textAlign: "right" }} onClick={handleMenuClose}>
                                                    <ListItemText primary="מוצרים" />
                                                </ListItem>
                                                <ListItem button component={Link} to="/Admin/TableAdmin" sx={{ textAlign: "right" }} onClick={handleMenuClose}>
                                                    <ListItemText primary="הזמנות" />
                                                </ListItem>
                                                <ListItem button component={Link} to="/Admin/ViewUsers" sx={{ textAlign: "right" }} onClick={handleMenuClose}>
                                                    <ListItemText primary="לקוחות" />
                                                </ListItem>
                                                <ListItem button onClick={handleLogout} sx={{ textAlign: "right" }}>
                                                    <ListItemText primary="התנתקות" />
                                                </ListItem>
                                            </List>
                                        </Popover>
                                    ) : (
                                        <Popover
                                            open={Boolean(anchorEl)}
                                            anchorEl={anchorEl}
                                            onClose={handleMenuClose}
                                            sx={{ marginTop: 3.5, marginLeft: 3.5 }}
                                        >
                                            <List>
                                                <ListItem button component={Link} to="/user/profile" sx={{ textAlign: "right" }} onClick={handleMenuClose}>
                                                    <ListItemText primary="הפרופיל שלי" />
                                                </ListItem>
                                                <ListItem button component={Link} to="/user/edit" sx={{ textAlign: "right" }} onClick={handleMenuClose}>
                                                    <ListItemText primary="עריכת פרטים" />
                                                </ListItem>
                                                <ListItem button onClick={handleLogout} sx={{ textAlign: "right" }}>
                                                    <ListItemText primary="התנתקות" />
                                                </ListItem>
                                            </List>
                                        </Popover>
                                    )}
                                </>
                            ) : (
                                <>
                                    <Button color="inherit" sx={{ marginLeft: 0 }}>
                                        <Link to={"/SignUp"} className="nav-link2">הרשמה</Link>
                                    </Button>
                                    <Button color="inherit">
                                        <Link to={"/SignIn"} className="nav-link2">התחברות</Link>
                                    </Button>
                                </>
                            )}
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </Box>
    );
}
export default Header;

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Link, useLocation } from "react-router-dom";
// import { useSelector } from "react-redux";
// import Cookies from "js-cookie";

// import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
// import AppBar from "@mui/material/AppBar";
// import Box from "@mui/material/Box";
// import Toolbar from "@mui/material/Toolbar";
// import Typography from "@mui/material/Typography";
// import Button from "@mui/material/Button";
// import IconButton from "@mui/material/IconButton";
// import { List } from "@mui/material";
// import { ListItem } from "@mui/material";
// import { ListItemText } from "@mui/material";
// import { Popover } from "@mui/material";
// import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

// import { useDispatch } from "react-redux";
// import { logout } from "../../redux/userSlice";

// import logo from "./logo.png";

// import "./Header.css";

// const Header = () => {
//   const [isLogin, setIsLogin] = React.useState(false);
//   const [lengthFavorite, setLengthFavorite] = React.useState([]);
//   const [admin, setAdmin] = React.useState(false);

//   const [anchorEl, setAnchorEl] = useState(null); // State for the Popover
//   // const [anchorElFavorite, setAnchorElFavorite] = useState(null); // State for the Popover
//   // const [favoriteLeght, setFavoriteLeght] = useState(0);
//   // const [permissions, setPermissions] = useState([]); // State for the Popover
//   // const [dataFavorite, setDataFavorite] = useState([]);
//   const [isPopoverOpen, setIsPopoverOpen] = useState(false);
//   const [cartLength, setCartLength] = useState([]);
//   const dispatch = useDispatch();
//   const userConnected = useSelector((state) => state.user.isAuthenticating);
//   const favorites = useSelector((state) => state.favorites.favorites);
//   const cart = useSelector((state) => state.cart);
//   const user = useSelector((state) => state.user.user);
//   const userCookies = Cookies.get("user");
//   const cartCookies = Cookies.get("cart");
//   const cartFromCookies = Cookies.get("favorites");
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     if (cartCookies) {
//       setCartLength(JSON.parse(cartCookies));
//     }
//   }, [cartCookies]);

//   useEffect(() => {
//     if (cartFromCookies) {
//       setLengthFavorite(JSON.parse(cartFromCookies));
//     }
//   }, [cartFromCookies]);

//   // useEffect(() => {
//     // console.log(cartCookies);
//     // setFavoriteLeght(favorites.length);
//     // setDataFavorite(favorites);
//   // }, [favorites]);

//   const handleLogout = () => {
//     dispatch(logout()); // Dispatch the logout action
//     localStorage.removeItem("user");
//     Cookies.remove("user", { path: "/" }); // Clear the user cookie
//     Cookies.remove("cart", { path: "/" });
//     Cookies.remove("favorites", { path: "/" });

//     navigate("/");
//     // Refresh the page
//     window.location.reload();
//   };

//   const handleMenuClick = (event) => {
//     setAnchorEl(event.currentTarget); // Open the Popover
//   };
//   const handleMenuClose = () => {
//     setAnchorEl(null); // Close the Popover
//   };

//   const handleMenuClickFavorite = (event) => {
//     if (isPopoverOpen) {
//       // Close the popover if it's open
//       setIsPopoverOpen(false);
//     } else {
//       // Open the popover
//       // setAnchorElFavorite(event.currentTarget);
//       setIsPopoverOpen(true);
//     }
//   };

//   useEffect(() => {
//     if (userCookies) {
//       // debugger;
//       const parsedCookies = JSON.parse(userCookies); // Ensure this parsing is correct
//       setIsLogin(true);

//       // setPermissions(parsedCookies.permission); // Set permissions correctly after parsing

//       if (parsedCookies.permission === "admin") {
//         // Direct comparison without JSON.stringify
//         setAdmin(true);
//       }
//     }
//   }, [userCookies]);
//   console.log(lengthFavorite.length);

//   return (
//     <Box
//       className="header"
//     >
//       <AppBar
//         sx={{ background: "black", color: "white", width: "100%" }}
//       >
//         <Toolbar>
//           <Typography variant="h6" component="div" sx={{ flexGrow: 0, padding: 1, marginRight: -3 }}>
//             <Link to={"/"}>
//               <img src={logo} alt="" sx={{ marginRight: -20, marginTop: 5 }} />
//             </Link>
//           </Typography>
//           <Typography variant="h6" component="div" className="nav" sx={{ flexGrow: 0, marginRight: 3 }}>
//             <Link to={"/"} className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>בית</Link>
//           </Typography>
//           <Typography variant="h6" component="div" className="nav" sx={{ flexGrow: 0, marginRight: 3 }}>
//             <Link to={"/Menu"} className={`nav-link ${location.pathname === '/Menu' ? 'active' : ''}`}>תפריט</Link>
//           </Typography>
//           <Typography variant="h6" component="div" className="nav" sx={{ flexGrow: 0, marginRight: 3 }}>
//             <Link to={"/Cart"} className={`nav-link ${location.pathname === '/Cart' ? 'active' : ''}`}>
//               סל קניות
//               {cartLength.length > 0 && (
//                 <Box
//                   sx={{
//                     position: "absolute",
//                     top: 26,
//                     bgcolor: "#C1121F",
//                     color: "white",
//                     fontSize: "10px",
//                     width: "20px",
//                     height: "20px",
//                     borderRadius: "50%",
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center",
//                     marginRight: 9
//                   }}
//                 >
//                   {cartLength.length}
//                 </Box>
//               )}
//             </Link>
//           </Typography>
//           <Typography variant="h6" component="div" className="nav" sx={{ flexGrow: 0, marginRight: 3 }}>
//             <Link to={"/Branches"} className={`nav-link ${location.pathname === '/Branches' ? 'active' : ''}`}>סניפים</Link>
//           </Typography>
//           <Typography variant="h6" component="div" className="nav" sx={{ flexGrow: 1, marginRight: 3 }}>
//             <Link to={"/About"} className={`nav-link ${location.pathname === '/About' ? 'active' : ''}`}>אודותינו</Link>
//           </Typography>

//           {isLogin ? (
//             <>
//               <Link to={"/favorites"}>
//                 <IconButton
//                   color="inherit"
//                   aria-haspopup="true"
//                   onClick={handleMenuClickFavorite}
//                   sx={{ marginRight: -10, flex: 10, '& .MuiSvgIcon-root': { fontSize: 32, color: "white" } }}
//                 >
//                   {/* <FavoriteIcon /> */}
//                   <FavoriteBorderOutlinedIcon />

//                   {lengthFavorite.length > 0 && (
//                     <Box
//                       sx={{
//                         position: "absolute",
//                         top: -1,
//                         bgcolor: "#C1121F",
//                         color: "white",
//                         fontSize: "10px",
//                         width: "20px",
//                         height: "20px",
//                         borderRadius: "50%",
//                         display: "flex",
//                         justifyContent: "center",
//                         alignItems: "center",
//                         marginRight: 4
//                       }}
//                     >
//                       {lengthFavorite.length}
//                       {/* {favorites.length} */}
//                     </Box>
//                   )}
//                 </IconButton>
//               </Link>

//               <IconButton
//                 color="inherit"
//                 aria-haspopup="true"
//                 onClick={handleMenuClick}
//                 sx={{ '& .MuiSvgIcon-root': { fontSize: 32 } }}
//               >
//                 <AccountCircleOutlinedIcon />
//               </IconButton>

//               {admin ? (
//                 <Popover
//                   open={Boolean(anchorEl)}
//                   anchorEl={anchorEl}
//                   onClose={handleMenuClose}
//                   sx={{ marginTop: 3.5, marginLeft: 3.5 }}
//                 >
//                   <List>
//                     <ListItem button component={Link} to="/Admin/Management" sx={{ textAlign: "right" }}>
//                       <ListItemText primary="מוצרים" />
//                     </ListItem>
//                     <ListItem button component={Link} to="/Admin/TableAdmin" sx={{ textAlign: "right" }}>
//                       <ListItemText primary="הזמנות" />
//                     </ListItem>
//                     <ListItem button component={Link} to="/Admin/ViewUsers" sx={{ textAlign: "right" }}>
//                       <ListItemText primary="לקוחות" />
//                     </ListItem>
//                     <ListItem button onClick={handleLogout} sx={{ textAlign: "right" }}>
//                       <ListItemText primary="התנתקות" />
//                     </ListItem>
//                   </List>
//                 </Popover>
//               ) : (
//                 <Popover
//                   open={Boolean(anchorEl)}
//                   anchorEl={anchorEl}
//                   onClose={handleMenuClose}
//                   sx={{ marginTop: 3.5, marginLeft: 3.5 }}
//                 >
//                   <List>
//                     <ListItem button component={Link} to="/user/profile" sx={{ textAlign: "right" }}>
//                       <ListItemText primary="הפרופיל שלי" />
//                     </ListItem>
//                     <ListItem button component={Link} to="/user/edit" sx={{ textAlign: "right" }}>
//                       <ListItemText primary="עריכת פרטים" />
//                     </ListItem>
//                     <ListItem button onClick={handleLogout} sx={{ textAlign: "right" }}>
//                       <ListItemText primary="התנתקות" />
//                     </ListItem>
//                   </List>
//                 </Popover>
//               )}
//             </>
//           ) : (
//             <>
//               <Button color="inherit" sx={{ marginLeft: 2 }}>
//                 <Link to={"/SignUp"} className="nav-link2">הרשמה</Link>
//               </Button>
//               <Button color="inherit">
//                 <Link to={"/SignIn"} className="nav-link2">התחברות</Link>
//               </Button>
//             </>
//           )}
//         </Toolbar>
//       </AppBar>
//     </Box>
//   );
// };

// export default Header;