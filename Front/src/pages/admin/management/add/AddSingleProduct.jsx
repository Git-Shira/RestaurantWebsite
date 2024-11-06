import React from "react";
import axios from "axios";

import { TextField, Box } from "@mui/material";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Grid } from "@mui/material";

import "./AddSingleProduct.css";

const AddSingleProduct = ({ setOpen }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  
  const [product, setProduct] = React.useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    amount: "",
    filter: "",
    show: "1"
  });
  const [age, setAge] = React.useState("");

  const AddProduct = async () => {
    const updateProduct = {
      ...product,
      category: age,
    };
    try {
      const response = await axios.post(
        `${apiUrl}/products/add`,
        // "http://localhost:3000/products/add",
        updateProduct
      );
      console.log(response.data);

      alert("המוצר נוסף בהצלחה");
      setTimeout(() => {
        setOpen(false);
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };
  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <form onSubmit={AddProduct} className="add">
      <Box component="form">
        <Grid container spacing={2} style={{ alignItems: "center" }} >
          <Grid item xs={12}>
            <TextField
              id="name"
              label="שם מלא"
              variant="outlined"
              fullWidth
              required
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              color="error"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="outlined-multiline-static"
              label="תיאור"
              multiline
              fullWidth
              rows={3}
              value={product.description}
              required
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
              color="error"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="image"
              label="קישור לתמונה"
              variant="outlined"
              fullWidth
              required
              value={product.image}
              onChange={(e) => setProduct({ ...product, image: e.target.value })}
              color="error"
            />
          </Grid>
          <Grid item sm={2.7} xs={4} >
            <TextField
              id="price"
              label="מחיר"
              type="number"
              variant="outlined"
              required
              value={product.price}
              onChange={(e) => setProduct({ ...product, price: e.target.value })}
              sx={{ width: 100 }}
              color="error"
            />
          </Grid>
          <Grid item sm={5.3} xs={6}>
            <FormControl required>
              <InputLabel id="filter-label">פילטר</InputLabel>
              <Select
                labelId="filter-label"
                id="filter"
                label="פילטר"
                fullWidth
                required
                value={product.filter}
                defaultValue={"0"}
                onChange={(e) => setProduct({ ...product, filter: e.target.value })}
                color="error"
                sx={{
                  width: 220
                }}
              >
                <MenuItem value={"0"}>ללא פילטר</MenuItem>
                <MenuItem value={"1"}>פופולארית</MenuItem>
                <MenuItem value={"12"}>פופולארית,חריפה</MenuItem>
                <MenuItem value={"13"}>פופולארית,טבעונית</MenuItem>
                <MenuItem value={"2"}>חריפה</MenuItem>
                <MenuItem value={"3"}>טבעונית</MenuItem>
                <MenuItem value={"23"}>חריפה,טבעונית</MenuItem>
                <MenuItem value={"123"}>פופולארית,חריפה,טבעונית</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item sm={4} xs={4}
            textAlign={"left"}
          >
            <FormControl required>
              <InputLabel id="category-label">קטגוריה</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                label="קטגוריה"
                fullWidth
                required
                value={age}
                onChange={handleChange}
                color="error"

                sx={{
                  width: 150
                }}>
                <MenuItem value={"ראשונות"}>ראשונות</MenuItem>
                <MenuItem value={"מרקים"}>מרקים</MenuItem>
                <MenuItem value={"סושי ספיישל"}>סושי ספיישל</MenuItem>
                <MenuItem value={"ניגירי"}>ניגירי</MenuItem>
                <MenuItem value={"סשימי"}>סשימי</MenuItem>
                <MenuItem value={"קומבינציות"}>קומבינציות</MenuItem>
                <MenuItem value={"מגשי מסיבה"}>מגשי מסיבה</MenuItem>
                <MenuItem value={"באנים"}>באנים</MenuItem>
                <MenuItem value={"מוקפצים"}>מוקפצים</MenuItem>
                <MenuItem value={"עיקריות"}>עיקריות</MenuItem>
                <MenuItem value={"סלטים"}>סלטים</MenuItem>
                <MenuItem value={"תפריט טבעוני"}>תפריט טבעוני</MenuItem>
                <MenuItem value={"קינוחים"}>קינוחים</MenuItem>
                <MenuItem value={"משקאות"}>משקאות</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={2} style={{
        alignItems: "center" }} >
        <Grid item  sm={12} xs={11.8} textAlign={"left"}>
          <button variant="contained" type="submit" className="btn"
          style={{ 
            marginTop:15
           }}
          >
            הוספה</button>
        </Grid>
      </Grid>

    </form>
  );
};

export default AddSingleProduct;