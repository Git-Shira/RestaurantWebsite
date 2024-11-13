import React, { useState, useEffect } from "react";
import axios from "axios";
import * as xlsx from 'xlsx';

import { Table, TableHead, TableBody, TableRow, TableCell, Button, Container } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { DialogContentText, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Grid } from "@mui/material";

import AOS from 'aos';

import t1 from "../../../IMAGES/t1.png";
import t2 from "../../../IMAGES/t2.png";

import "./TableAdmin.css";

const TableAdmin = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // State to store the ID of the selected user
  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/cart/all`);
        // const response = await axios.get(`http://localhost:3000/cart/all`);
        setUserData(response.data.carts);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();

    AOS.init();
  }, []);

  const [selectedBranch, setSelectedBranch] = useState("");
  const handleChange = (event) => {
    setSelectedBranch(event.target.value);
  };

  const resetFilter = () => {
    setSelectedBranch("");
  };
  console.log(userData);

  const exportToExcel = () => {
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.aoa_to_sheet([['userId', 'fullName', 'date', 'branch', 'typePay', 'typeCollect', 'products', 'totalPrice']]);

    // Iterate over each userData object
    userData.forEach((order, index) => {
      // Extract order details
      const { userId, fullName, date, branch, typePay, typeCollect, products, totalPrice } = order;
      // Create a string to represent the products
      const productsString = products.map(product => `${product.name} - ${product.quantity}x ₪${product.price}`).join(', ');
      // Add order details to the worksheet
      xlsx.utils.sheet_add_aoa(ws, [[userId, fullName, date, branch, typePay, typeCollect, productsString, totalPrice]], { origin: index + 1 });
    });

    xlsx.utils.book_append_sheet(wb, ws, "Orders");
    const excelBuffer = xlsx.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAsExcelFile(excelBuffer, "orders.xlsx");
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
    <div style={{ minHeight: "100vh" }}>
      <div className="title-design">
        <img src={t1} alt="" className="t1" data-aos="fade-left" data-aos-duration="1000" />
        <h1 data-aos="flip-down" data-aos-duration="1000">ארכיון הזמנות</h1>
        <img src={t2} alt="" className="t2" data-aos="fade-right" data-aos-duration="1000" />
      </div>

      <Grid container spacing={1}
        style={{ alignItems: "center" }}>
        <Grid item md={8.75} xs={9}  >
          <div
            className="table-admin-search"
            style={{
              marginTop: "10px",
              display: "flex",
              alignItems: "center",
              marginBottom: "10px"
            }}
          >
            <strong
              style={{
                marginLeft: 5,
                // marginRight: 320,
                color: "#C1121F",
                fontSize: "larger"
              }}
            >סינון לפי סניף:&nbsp;</strong>

            <FormControl sx={{ marginRight: 2 }}>
              <InputLabel id="filter-label">בחירת סניף</InputLabel>
              <Select
                labelId="branch-label"
                id="branch"
                label="בחירת סניף"
                fullWidth
                required
                value={selectedBranch}
                onChange={handleChange}
                color="error"
                sx={{ width: 180, }}
              >
                <MenuItem value={"אשדוד"}>אשדוד</MenuItem>
                <MenuItem value={"באר שבע"}>באר שבע</MenuItem>
                <MenuItem value={"רמת גן"}>רמת גן</MenuItem>
                <MenuItem value={"תל אביב"}>תל אביב</MenuItem>
                <MenuItem value={"לוד"}>לוד</MenuItem>
                <MenuItem value={"ראש העין"}>ראש העין</MenuItem>
                <MenuItem value={"כפר סבא"}>כפר סבא</MenuItem>
                <MenuItem value={"נתניה"}>נתניה</MenuItem>
                <MenuItem value={"עפולה"}>עפולה</MenuItem>
                <MenuItem value={"קרית אתא"}>קרית אתא</MenuItem>
              </Select>
            </FormControl>

            <div className="reset">
              {(selectedBranch &&
                <button className="btn"
                  onClick={() => {
                    resetFilter();
                  }}
                  style={{ marginRight: 85 }}>איפוס סינון</button>
              )}
            </div>

          </div>
        </Grid>
        <Grid item sm={2} xs={3}>
          <div className="orders">
            <button variant="contained" className="btn" onClick={exportToExcel}
            >ייצוא ל-Excel</button>
          </div>
        </Grid>
      </Grid>

      {
        loading ? (
          <p
            style={{ marginTop: "20px" }}
          >טוען...</p>
        ) : error ? (
          <p
            style={{ marginTop: "20px" }}
          >Error: {error.message}</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <Table className="table table-bordered" style={{
              maxWidth: 1000, marginTop: "20px"
            }}>
              <TableHead>
                <TableRow style={{ borderColor: "#C1121F" }} className="table-row">
                  <TableCell align="center" > תאריך</TableCell>
                  <TableCell align="center" >מספר הזמנה</TableCell>{" "}
                  <TableCell align="center" >סניף</TableCell>{" "}
                  <TableCell align="center" >שם המזמין</TableCell>
                  <TableCell align="center" >סוג איסוף</TableCell>
                  <TableCell align="center" >אופן תשלום</TableCell>
                  <TableCell align="center" >מחיר כולל</TableCell>
                  <TableCell align="center" >פרטי הזמנה</TableCell>
                </TableRow>

              </TableHead>
              <TableBody>
                {userData?.filter(
                  (user) =>
                  (selectedBranch === ""
                    ? true
                    : user.branch === selectedBranch)
                ).map((user) => (
                  <TableRow style={{ borderColor: "#C1121F", borderRadius: 2 }} key={user._id}>
                    <TableCell align="center" >
                      {user.date}</TableCell>
                    <TableCell align="center" >
                      {user._id}</TableCell>
                    <TableCell align="center" >
                      {user.branch}</TableCell>
                    <TableCell align="center" >
                      {user.fullName}</TableCell>
                    <TableCell align="center" >
                      {user.typePay}</TableCell>
                    <TableCell align="center" >
                      {user.typeCollect}</TableCell>
                    <TableCell align="center" >
                      {user.totalPrice} ₪</TableCell>
                    <TableCell align="center" >
                      <Button onClick={() => handleOpenModal(user)}
                        sx={{ color: "#C1121F", "&:hover": { backgroundColor: "black", color: "white" } }}
                      > פרטי הזמנה
                      </Button>
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )
      }
      <Dialog open={openModal} onClose={handleCloseModal} aria-labelledby="alert-dialog-title"
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
            onClick={handleCloseModal}
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
          <DialogContentText id="alert-dialog-description"
            sx={{
              width: 550,
              height: 480,
            }}
          >
            <h2 style={{ color: "#C1121F", fontWeight: "bold", marginBottom: 10 }}>פרטי הזמנה</h2>
            <Table className="table table-bordered">
              <TableHead>
                <TableRow style={{ borderColor: "#C1121F" }} className="table-row">
                  <TableCell align="center">שם מוצר</TableCell>
                  <TableCell align="center" style={{ width: 50 }}>כמות</TableCell>
                  <TableCell align="center" style={{ width: 70 }}>מחיר</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedUser?.products?.map((product, productIndex) => (
                  <TableRow style={{ borderColor: "#C1121F" }} className="table-row" key={productIndex}>
                    <TableCell align="center">{product.name}</TableCell>
                    <TableCell align="center">{product.quantity}</TableCell>
                    <TableCell align="center">{product.price} ₪</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div >
  );
};

export default TableAdmin;