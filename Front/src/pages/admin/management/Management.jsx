import React, { useEffect, useState } from "react";
import axios from "axios";
import * as xlsx from 'xlsx';

import { Container } from "@mui/system";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { TextField } from "@mui/material";
import Pagination from "@mui/material/Pagination";

import AddSingleProduct from "./add/AddSingleProduct";
import ProductsCard from "../../../components/card/products/ProductsCard";

import AOS from 'aos';

import t1 from "../../../IMAGES/t1.png";
import t2 from "../../../IMAGES/t2.png";

import "./Management.css";

const Management = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [open, setOpen] = React.useState(false);
  const [allProducts, setAllProducts] = useState([]);

  const [search, setSearch] = React.useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20); // Number of items per page

  const paginate = (event, value) => setCurrentPage(value);

  const filteredProducts = allProducts.filter(
    (product) =>
      product.name.toLowerCase().startsWith(search.toLowerCase())
  );

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1); // Reset pagination when search changes
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${apiUrl}/products/all`);
      // const response = await axios.get("http://localhost:3000/products/all");
      setAllProducts(response?.data.products);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    AOS.init();

    fetchProducts();
  }, []);

  const exportToExcel = () => {
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(allProducts);
    xlsx.utils.book_append_sheet(wb, ws, "Products");
    const excelBuffer = xlsx.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAsExcelFile(excelBuffer, "products.xlsx");
  };

  const saveAsExcelFile = (buffer, fileName) => {
    const data = new Blob([buffer], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  };

  return (
    <div className="management" style={{ minHeight: "100vh" }}>


      <div className="title-design">
        <img src={t1} alt="" className="t1" data-aos="fade-left" data-aos-duration="1000" />
        <h1 data-aos="flip-down" data-aos-duration="1000">ניהול מוצרים</h1>
        <img src={t2} alt="" className="t2" data-aos="fade-right" data-aos-duration="1000" />
      </div>

      <Container sx={{ marginTop: "10px", }}>
        <button className="btn"
          style={{ marginBottom: 15 }}
          onClick={handleClickOpen}>הוספת מוצר חדש</button>

        <button variant="contained" className="btn" onClick={exportToExcel} style={{ marginBottom: 15, marginRight: 35 }}>ייצוא ל-Excel</button>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 50 }}>
          <strong style={{
            marginLeft: 5, color: "#C1121F", fontSize: "larger"
          }}>
            חיפוש מנה: &nbsp;
          </strong>

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
          <div className="reset">
            {search &&
              <button className="btn"
                onClick={() => {
                  setSearch("");
                }}
                style={{ marginRight: 85 }}>נקה סינון</button>
            }
          </div>

        </div>
        <div className="dishes">
          <div className="box-container">
            {/* {allProducts ? (
              allProducts?.filter(
                (product) =>
                  product.name.toLowerCase().startsWith(search.toLowerCase())
              )

                .map((product, index) => { */}
            {currentItems ? (
              currentItems.map((product) => {
                return (
                  <>
                    <ProductsCard key={product._id} product={product} fetchProducts={fetchProducts} />
                  </>
                );
              })
            ) : (
              <p>No products available</p>
            )
            }
          </div>
        </div>
        <Pagination
          className="pagination"
          count={Math.ceil(filteredProducts.length / itemsPerPage)}
          page={currentPage}
          onChange={paginate}
          variant="outlined" color="error"
        />

        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
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
          <DialogContent>
            <AddSingleProduct setOpen={setOpen} />
          </DialogContent>
          <DialogActions></DialogActions>
        </Dialog>
      </Container>

    </div>
  );
};

export default Management;