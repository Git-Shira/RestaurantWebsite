import React, { useState, useEffect } from "react";
import axios from "axios";

import { Table, TableHead, TableBody, TableRow, TableCell, Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { DialogContentText } from "@mui/material";
import { DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const TableOrder = ({ id }) => {
  const apiUrl = process.env.REACT_APP_API_URL;

  console.log("id", id);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [idPerson, setIdPreson] = useState("");
  const [selectedUser, setSelectedUser] = useState([]); // State to store the ID of the selected user

  const handleOpenModal = (data) => {
    setOpenModal(true);
    setSelectedUser(data);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  useEffect(() => {
    setIdPreson(id._id);
  }, [id._id]);

  useEffect(() => {
    const fetchData = async () => {
      if (!idPerson) return;

      console.log("id", idPerson);

      try {
        if (idPerson) {
          const response = await axios.get(
            `${apiUrl}/cart/user/${idPerson}/getOrders`
            // `http://localhost:3000/cart/user/${idPerson}/getOrders`
          );
          if (response.status === 200) {
            setUserData(response.data.orders);
            setLoading(false);
          }
        }

      } catch (error) {
        setLoading(false);
        if (error.response.status === 404) {
          setError({ message: "לא בוצעו עדיין הזמנות" });
        } else if (error.response.status === 500) {
          setError(error);
        }
      }
    };

    fetchData();
  }, [idPerson]);

  console.log(userData);

  return (
    <div className="profile-user">

      {loading ? (
        <p style={{ color: "white", marginTop: 30 }}>טוען...</p>
      ) : error ? (
        <p style={{ color: "white", marginTop: 30 }}>{error.message}</p>
      ) : (
        <div style={{ overflowX: 'auto', overflowY: 'auto' }}>

          <Table className="table table-bordered"
            style={{
              maxWidth: 1000, marginTop: 30
            }}
          >
            <TableHead>
              <TableRow style={{ borderColor: "#C1121F" }} className="table-row">
                <TableCell align="center" >תאריך</TableCell>
                <TableCell align="center" >מספר הזמנה</TableCell>
                <TableCell align="center" >סניף</TableCell>
                <TableCell align="center" >מחיר כולל</TableCell>
                <TableCell align="center" >פרטי הזמנה</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userData.map((user) => (
                <TableRow style={{ borderColor: "#C1121F", borderRadius: 2 }}>
                  <TableCell align="center" >
                    {user.date}</TableCell>
                  <TableCell align="center" >
                    {user._id}</TableCell>
                  <TableCell align="center" >
                    {user.branch}</TableCell>
                  <TableCell align="center" >
                    {user.totalPrice} ₪</TableCell>{" "}
                  <TableCell align="center" >

                    <Button onClick={() => handleOpenModal(user)}
                      sx={{ color: "#C1121F", "&:hover": { backgroundColor: "black", color: "white" } }}
                    >
                      פרטי הזמנה
                    </Button>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <Dialog open={openModal} onClose={handleCloseModal} aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <DialogTitle>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleCloseModal}
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
            <h2 style={{ color: "#C1121F", fontWeight: "bold", marginBottom: 10 }}>פרטי הזמנה</h2>
            <div style={{ overflowX: 'auto' }}>
              <Table className="table table-bordered" style={{ width: 300 }}>
                <TableHead>
                  <TableRow style={{ borderColor: "#C1121F" }} className="table-row">
                    <TableCell align="center" style={{ width: 80 }}>שם מוצר</TableCell>
                    <TableCell align="center" style={{ width: 50 }}>מחיר</TableCell>
                    <TableCell align="center" style={{ width: 50 }}>כמות</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedUser?.products?.map((product) => {
                    return (
                      <TableRow style={{ borderColor: "#C1121F" }} className="table-row"
                        key={product._id}>
                        <TableCell align="center">{product.name}</TableCell>
                        <TableCell align="center">{product.price}</TableCell>
                        <TableCell align="center">{product.quantity}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TableOrder;