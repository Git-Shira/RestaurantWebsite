import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

import { Container } from "@mui/system";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { DialogContentText } from "@mui/material";
import { DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { TextField } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { HeartBroken, Visibility } from "@mui/icons-material";
import Pagination from "@mui/material/Pagination";

import { useSelector, useDispatch } from "react-redux";
import { addToFavorites, removeFromFavorites } from "../../redux/favoritesSlice";
import { addItem } from "../../redux/cartSlice";

import AOS from 'aos';

import t1 from "../../IMAGES/t1.png";
import t2 from "../../IMAGES/t2.png";

import "./Products.css";

const Products = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const productsDivRef = useRef(null);

  const [products, setProducts] = React.useState([]);
  const [selectedProduct, setSelectedProduct] = React.useState();
  const [selectCategory, setSelectCategory] = React.useState([]);

  const [priceRange, setPriceRange] = React.useState([0, 449]);
  const [open, setOpen] = React.useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20); // Number of items per page

  const userCookies = Cookies.get("user");
  const user = userCookies ? JSON.parse(userCookies) : null;

  const [selectedButton, setSelectedButton] = useState([]);

  const [search, setSearch] = React.useState("");

  const categorys = ["ראשונות", "מרקים", "סושי ספיישל", "ניגירי", "סשימי", "קומבינציות", "מגשי מסיבה", "באנים", "מוקפצים", "עיקריות", "סלטים", "תפריט טבעוני", "קינוחים", "משקאות"];

  const [closeIt, setCloseIt] = React.useState(false);
  const handleOpenIt = () => {
    setCloseIt(true);
  }
  const handleCloseIt = () => {
    setCloseIt(false);
  }
  const handleClose = () => {
    setOpen(false);
  };

  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.favorites); // Updated selector

  const addShoppingCart = (products) => {
    dispatch(
      addItem({
        id: products._id,
        name: products.name,
        price: products.price,
        image: products.image,
        quantity: 1,
        filter: products.filter,
        show: 1
      })
    );
  };

  const addToCart = () => {
    if (selectedProduct) {
      dispatch(
        addItem({
          id: selectedProduct._id,
          name: selectedProduct.name,
          price: selectedProduct.price,
          image: selectedProduct.image,
          filter: selectedProduct.filter,
          quantity: 1,
          show: 1
        })
      );
    }
  };

  const getProducts = async () => {
    try {
      const response = await axios.get(`${apiUrl}/products/all`);
      // const response = await axios.get("http://localhost:3000/products/all");
      console.log(response);
      setProducts(response.data.products);
    } catch (error) {
      console.log(error);
    }
  };

  const resetFilter = () => {
    setSelectedButton([]);
    setSelectCategory([]);

    setPriceRange([0, 449]);

    setSearch("");

    setCurrentPage(1); // Reset pagination when search changes
  };

  useEffect(() => {
    AOS.init();

    getProducts();
  }, []);

  const handleChange = (category) => {
    if (selectedButton.includes(category)) {
      setSelectedButton(selectedButton.filter((item) => item !== category));
      setSelectCategory(selectCategory.filter((item) => item !== category));
    } else {
      setSelectedButton([...selectedButton, category]);
      setSelectCategory([...selectCategory, category]);
    }

    setCurrentPage(1); // Reset pagination when search changes
  };

  const isButtonSelected = (category) => {
    return selectedButton.includes(category);
  };

  const handleChangePrice = (event, newValue) => {
    setPriceRange(newValue);
    setCurrentPage(1); // Reset pagination when search changes
  };

  const isFavorite = (productId) => {
    return favorites.some((favorite) => favorite._id === productId);
  };
  const handleFavoriteToggle = (product) => {
    const isAlreadyFavorite = favorites.some(
      (favorite) => favorite._id === product._id
    );
    if (isAlreadyFavorite) {
      dispatch(removeFromFavorites(product._id));
    } else {
      dispatch(addToFavorites(product));
    }
  };
  console.log(isFavorite);

  const messages = [
    'במידה ויש שינוי שאותו אתם רוצים לבצע בהזמנה יש להתקשר לסניף ולבצע שינוי זה ',
    'בעקבות מזג האוויר ייתכנו זמני המתנה ארוכים מהרגיל, אנו פועלים על מנת לספק את ההזמנות מהר ככל האפשר',
    <span>לחצו על ה- <FavoriteIcon /> כדי להוסיף למוצרים האהובים</span>,
    <span>לחצו על ה- <Visibility /> כדי לראות פרטים נוספים על המנה</span>
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextMessage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
  };

  const prevMessage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + messages.length) % messages.length);
  };

  useEffect(() => {
    const intervalId = setInterval(nextMessage, 10000); // 5000 milliseconds = 5 seconds

    return () => clearInterval(intervalId);
  }, []); // Run once on mount to start the automatic rotation

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1); // Reset pagination when search changes
  };

  const paginate = (event, value) => {
    setCurrentPage(value);
    // window.scrollTo(0, 0);
    if (productsDivRef.current) {
      window.scrollTo(0, productsDivRef.current.offsetTop - 350);
    }
  }

  const filteredProducts = products.filter(
    (product) =>
      (selectCategory.length === 0)
        ? product.price >= priceRange[0] &&
        product.price <= priceRange[1] &&
        product.name.toLowerCase().startsWith(search.toLowerCase()) &&
        product.show === 1
        :
        selectCategory.includes(product.category) &&
        product.price >= priceRange[0] &&
        product.price <= priceRange[1] &&
        product.name.toLowerCase().startsWith(search.toLowerCase()) &&
        product.show === 1
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <Container>
        <div className="title-design">
          <img src={t1} alt="" className="t1" data-aos="fade-left" data-aos-duration="1000" />
          <h1 data-aos="flip-down" data-aos-duration="1000">התפריט שלנו</h1>
          <img src={t2} alt="" className="t2" data-aos="fade-right" data-aos-duration="1000" />
        </div>

        <div className="message-container">
          <h5>שימו לב ! </h5>
          {/* <br /> */}
          <h5 key={currentIndex}>{messages[currentIndex]}</h5>
        </div>

        <div className="buttons-container">
          <button onClick={prevMessage} className="btn-prev"><i className="fa fa-caret-right" aria-hidden="true"></i>
          </button>
          <button onClick={nextMessage} className="btn-next"><i className="fa fa-caret-left" aria-hidden="true"></i>
          </button>
        </div>

        <div className="categories">
          {categorys.map((category, index) => {
            return (
              <button
                className="button-category"
                key={index}
                onClick={() => {
                  handleChange(category);
                }}
                style={{
                  backgroundColor: isButtonSelected(category) ? "black" : "white", // Change to black when selected
                  color: isButtonSelected(category) ? "#C1121F" : "black",
                  fontWeight: isButtonSelected(category) ? "bold" : "normal"
                }}
              >
                {category}
              </button>
            );
          })}
        </div>
        <div className="search-products" style={{ display: 'flex', alignItems: 'center', marginBottom: 50 }}>
          <strong style={{
            marginLeft: 5, color: "#C1121F", fontSize: "larger"
          }}>
            סינון לפי מחיר: &nbsp;
          </strong>

          <div style={{ alignItems: 'center', display: "flex" }}>
            {priceRange[1]} ₪

            <Box
              sx={{
                width: { md: 300, xs: 150 },
                marginRight: 2, marginLeft: 2
              }}
            >
              <Slider
                className="price-range"
                value={priceRange}
                onChange={handleChangePrice}
                aria-label="Price range"
                defaultValue={20}
                valueLabelDisplay="auto"
                step={10}
                marks
                min={0}
                max={449}
                sx={{ color: "#C1121F", height: 10, }} />
            </Box>
            {priceRange[0]} ₪
          </div>

          <div style={{ alignItems: 'center', display: "flex" }}>
            <strong
              className="search-dishes"
              style={{
                marginRight: 50,
                marginLeft: 5,
                color: "#C1121F",
                fontSize: "larger"
              }}
            >חיפוש מנה: &nbsp;</strong>
            <TextField
              id="outlined-basic"
              className="search"
              label="חיפוש"
              type={"text"}
              variant="outlined"
              onChange={handleSearchChange}
              value={search}
              defaultValue={search}
              autoComplete="off"
              color="error"
            />
          </div>
          <div className="reset">
            {(selectCategory.length !== 0 || search || priceRange[0] !== 0 || priceRange[1] !== 449) &&
              <button className="btn"
                onClick={() => {
                  resetFilter();
                }}
                style={{ marginRight: 85 }}>איפוס סינון</button>
            }
          </div>
        </div>

        <div className="dishes" ref={productsDivRef}>
          <div className="box-container">
            {currentItems.map((product) => {
              console.log(product._id);
              return (
                <div data-aos="zoom-in">
                  <div className="box">
                    <IconButton className="eye"
                      onClick={() => {
                        setSelectedProduct(product);
                        setOpen(true);
                      }}>
                      <Visibility />
                    </IconButton>

                    <IconButton
                      className="heart"
                      onClick={() => {
                        if (!user) {
                          handleOpenIt();
                        }
                        else
                          handleFavoriteToggle(product);
                      }}
                    >
                      <FavoriteIcon
                        // color={isFavorite(product._id) ? "error" : "disabled"}
                        color={isFavorite(product._id) ? "black" : "disabled"}
                      />
                    </IconButton>
                    <img src={product.image} alt={product.name} />

                    <div style={{ height: 20, alignItems: "center", margin: 0 }}>
                      <h5> {product.name}</h5>
                    </div>
                    <br />
                    <span className="product-price"> {product.price} ₪</span>

                    <button className="btn"
                      onClick={() => {
                        addShoppingCart(product);
                      }}>
                      הוספה לסל</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <Pagination
          className="pagination"
          count={Math.ceil(filteredProducts.length / itemsPerPage)}
          page={currentPage}
          onChange={paginate}
          variant="outlined" color="error"
        />

        {selectedProduct && (
          <Dialog
            className="product-dialog"
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            <DialogTitle>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
                sx={{
                  position: 'absolute',
                  left: 50,
                  top: 15,
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description"
                sx={{
                  width: 550,
                  height: 480,
                }}
              >
                <h2> {selectedProduct.name}</h2>
                <p className="description"> {selectedProduct.description}</p>
                <img src={selectedProduct.image} alt="" />
                <button className="btn" onClick={addToCart} autoFocus sx={{ display: 'flex', }}>
                  הוספה לסל
                </button>
                <h2 className="price"> {selectedProduct.price} ₪</h2>
                <div className="filter-values">
                  {(selectedProduct.filter === "1" || selectedProduct.filter === "12" || selectedProduct.filter === "123" || selectedProduct.filter === "13") && <i className="fas fa-crown">&nbsp; מנה פופולארית </i>}
                  {(selectedProduct.filter === "2" || selectedProduct.filter === "12" || selectedProduct.filter === "123" || selectedProduct.filter === "23") && <i className="fas fa-pepper-hot">&nbsp; מנה חריפה </i>}
                  {(selectedProduct.filter === "3" || selectedProduct.filter === "13" || selectedProduct.filter === "123" || selectedProduct.filter === "23") && <i className="fas fa-leaf">&nbsp; מנה טבעונית </i>}
                </div></DialogContentText>
            </DialogContent>
          </Dialog>
        )}

        <Dialog
          className="not-connected-dialog"
          open={closeIt}
          onClose={handleCloseIt}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <DialogTitle>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleCloseIt}
              aria-label="close"
              sx={{
                position: 'absolute',
                left: 15,
                top: 0,
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent
            sx={{
              height: { xs: 150, sm: 150 },
              width: { xs: 250, sm: 400 },
              paddingTop: 7,
              marginTop: 3,
              paddingLeft: 3,
              paddingRight: 3,
              textAlign: 'center'
            }}
          >
            כדי לסמן מוצרים אהובים עליכם להתחבר לחשבון
            <br />
            <button className="btn" sx={{ marginBottom: 15 }}>
              <Link to={"/SignIn"} className="button-link"> לחצו להתחברות</Link>
            </button>
          </DialogContent>
          <DialogActions>
          </DialogActions>
        </Dialog>
      </Container>
    </div >
  );
};

export default Products;