import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from 'date-fns';

import { TextField, Autocomplete, Box, FormControl, InputLabel, MenuItem, Select, FormControlLabel, FormLabel, RadioGroup, Radio } from "@mui/material";
import Alert from "@mui/material/Alert";
import { Grid } from "@mui/material";
import useMediaQuery from '@mui/material/useMediaQuery';

import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../../redux/cartSlice";

import Receipt from "./Receipt";

import AOS from 'aos';

import t1 from "../../IMAGES/t1.png";
import t2 from "../../IMAGES/t2.png";

import "./Pay.css";

const Pay = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const [id, setId] = useState(null);
  const [fullName, setFullName] = useState("");

  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardType, setCardType] = useState("");
  const [cardMonth, setCardMonth] = useState("");
  const [cardYear, setCardYear] = useState("");

  const [city, setCity] = useState(null);
  const [street, setStreet] = useState("");

  const [currentDate, setCurrentDate] = useState(new Date());
  const dateFormat = 'dd/MM/yyyy';
  const formattedDate = format(currentDate, dateFormat);

  const [comments, setComments] = useState("");

  // עדכון של התאריך בכל שינוי בתוך הקומפוננטה
  useEffect(() => {
    setInterval(() => {
      setCurrentDate(new Date());
    }, 10000); // עדכון כל שנייה
  }, []);

  const [branch, setBranch] = useState("");
  const handleChangeBranch = (event) => {
    if (!city)
      setBranch(event.target.value);
  };

  const [typeCollect, setTypeCollect] = React.useState("");
  const handleChangeCollect = (event) => {
    setTypeCollect(event.target.value);
    if (event.target.value === "איסוף עצמי") {
      setCity(null);
    }
  };

  const [typePay, setTypePay] = React.useState("");
  const handleChangePay = (event) => {
    setTypePay(event.target.value);
  };


  const navigation = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setId(user?._id);
  }, []);

  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [vaildationError, setVaildationError] = useState({});

  const Validate = () => {
    const error = {};
    if (!fullName) {
      error.fullName = "שדה חובה";
    } else if (!/^[א-תa-zA-Z]+( [א-תa-zA-Z]+)*$/.test(fullName)) {
      error.fullName = "אנא הכנס שם מלא תקני, ללא רווחים ריקים בתחילה או בסוף";
    }
    if (!(typeCollect === "משלוח" || typeCollect === "איסוף עצמי")) {
      error.typeCollect = "שדה חובה";
    }
    if (typeCollect === "משלוח" && !city) {
      error.city = "שדה חובה";
    } else if (typeCollect === "משלוח" && !/^[א-ת]+( [א-ת]+)*$/.test(city)) {
      error.city = "אנא הכנס שם עיר תקני, ללא רווחים ריקים בתחילה או בסוף";
    }
    if (typeCollect === "משלוח" && !street) {
      error.street = "שדה חובה";
    } else if (typeCollect === "משלוח" && !/^[א-ת0-9]+( [א-ת0-9]+)*$/.test(street)) {
      error.street = "אנא הכנס כתובת תקינה, ללא רווחים ריקים בתחילה או בסוף";
    }
    if (!(typePay === "מזומן" || typePay === "אשראי")) {
      error.typeCollect = "שדה חובה";
    }
    if (typePay === "אשראי" && !cardNumber) {
      error.cardNumber = "שדה חובה";
    }
    if (typePay === "אשראי" && !cardHolder) {
      error.cardHolder = "שדה חובה";
    } else if (typePay === "אשראי" && !/^[א-תa-zA-Z]+( [א-תa-zA-Z]+)*$/.test(cardHolder)) {
      error.cardHolder = "אנא הכנס שם מלא תקני, ללא רווחים ריקים בתחילה או בסוף";
    }
    if (typePay === "אשראי" && !cardMonth) {
      error.cardMonth = "שדה חובה";
    } else if (typePay === "אשראי" && (cardMonth > 12 || cardMonth < 1)) {
      error.cardMonth = "מספר חודש לא תקין";
    }
    if (typePay === "אשראי" && !cardYear) {
      error.cardYear = "שדה חובה";
    } else if (typePay === "אשראי" && (cardYear < 2024)) {
      error.cardYear = " תוקף הכרטיס פג";
    }
    if (typePay === "אשראי" && !cardCvv) {
      error.cardCvv = "שדה חובה";
    } else if (typePay === "אשראי" && (cardCvv.length !== 3)) {
      error.cardCvv = "CVV לא תקין";
    }
    if (typePay === "אשראי" && !cardType) {
      error.cardType = "שדה חובה";
    }
    setVaildationError(error);
    return Object.keys(error).length === 0;
  };

  useEffect(() => {
    AOS.init();
  }, []);

  const [paid, setPaid] = useState(false);
  const [receiptDetails, setReceiptDetails] = useState("");

  const handleSubmit = async (e) => {
    if (Validate()) {
      const userData = {
        userId: id,
        fullName: fullName,

        typeCollect: typeCollect,
        street: street,
        city: city,

        branch: branch,

        typePay: typePay,
        cardNumber: cardNumber,
        cardHolder: cardHolder,
        cardMonth: cardMonth,
        cardYear: cardYear,
        cardCvv: cardCvv,
        cardType: cardType,

        totalPrice: cart.totalAmount,
        date: formattedDate,

        products: [...cart.items],

        comments: comments,
      };
      setReceiptDetails(userData);

      if (id) {
        try {
          const response = await axios.post(
            `${apiUrl}/cart/user/${id}/new_order`,
            // `http://localhost:3000/cart/user/${id}/new_order`,
            userData
          );
          const user = response.data;
          if (user) {
            if (response.status === 200) {
              setError("");
              setSuccess("הזמנתך התקבלה בהצלחה");

              setTimeout(() => {
                setPaid(true);
              }, 3000);

              dispatch(clearCart());
            }
            else {
              setSuccess("");
              setError("התחברו לחשבון כדי להשלים את ההזמנה");
            }
          }

        } catch (err) {
          setSuccess("");
          if (err.response.status === 400) {
            setError("התחברו לחשבון כדי להשלים את ההזמנה");
          }
          if (err.response.status === 500) {
            setError("משהו השתבש, נסו שוב")
          }
          console.error(err);
        }
      }
      else {
        try {
          const response = await axios.post(
            `${apiUrl}/cart/add`,
            // `http://localhost:3000/cart/add`,
            userData
          );
          const order = response.data;
          if (order) {
            if (response.status === 200) {
              setError("");
              setSuccess("הזמנתך התקבלה בהצלחה");

              setTimeout(() => {
                setPaid(true);
              }, 3000);

              dispatch(clearCart());
            }
            else {
              setSuccess("");
              setError("משהו השתבש, נסו שוב")
            }
          }

        } catch (err) {
          setSuccess("");
          if (err.response.status === 500) {
            setError("משהו השתבש, נסו שוב")
          }
          console.error(err);
        }
      }
    }
  };

  const [settlements, setSettlements] = useState([]);
  const [namesOfSettlements, setNamesOfSettlements] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://data.gov.il/api/3/action/datastore_search', {
          params: {
            resource_id: 'd4901968-dad3-4845-a9b0-a57d027f11ab' // מזהה המשאב (resource id) 
          }
        });

        const settlementsData = response.data.result.records
          .filter(record => !record.שם_ישוב.includes("שבט") && !record.שם_ישוב.includes("לא רשום"))
          .map(record => {
            let settlementName = record.שם_ישוב;
            let newSettlementName = '';
            for (let i = 0; i < settlementName.length; i++) {
              if (settlementName[i] === '(') {
                newSettlementName += ')';
              } else if (settlementName[i] === ')') {
                newSettlementName += '(';
              } else {
                newSettlementName += settlementName[i];
              }
            }
            return {
              name: newSettlementName.trim(),
              nearestSettlement: record.לשכה
            };
          });

        setSettlements(settlementsData);

        const namesOfSettlements = settlementsData.map(settlement => settlement.name);
        setNamesOfSettlements(namesOfSettlements);
      } catch (error) {
        console.error('Error fetching settlements:', error);
      }
    };
    fetchData();
  }, []);

  const handleChangeSettlement = (event, value) => {
    setCity(value);
    const selectedSettlement = settlements.find(settlement => settlement.name === value);
    if (selectedSettlement) {
      const office = selectedSettlement.nearestSettlement;
      const trimmedOffice = office.trim(); // מחיקת רווחים מתחילת ומסוף המחרוזת
      switch (trimmedOffice) {
        case "אשקלון":
          setBranch("אשדוד");
          break;
        case "אילת":
        case "באר שבע":
          setBranch("באר שבע");
          break;
        case "בני ברק":
        case "רמת גן":
          setBranch("רמת גן");
          break;
        case "תל אביב":
        case "חולון":
          setBranch("תל אביב");
          break;
        case "רמלה":
        case "בית שמש":
        case "לוד":
        case "ירושלים":
          setBranch("לוד");
          break;
        case "ראש העין":
        case "פתח תקוה":
        case "אריאל":
          setBranch("ראש העין");
          break;
        case "הרצליה":
        case "כפר סבא":
          setBranch("כפר סבא");
          break;
        case "נתניה":
          setBranch("נתניה");
          break;
        case "עפולה":
        case ("חדרה"):
        case ("טבריה"):
        case ("נצרת עילית"):
          setBranch("עפולה");
          break;
        case ("חיפה"):
        case ("כרמיאל"):
        case ("עכו"):
        case "צפת":
          setBranch("קרית אתא");
          break;
        default:
          setCity(null);
          break;
      }
    }
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      {!paid && cart.totalAmount !== 0 && (
        <div>
          <div className="title-design">
            <img src={t1} alt="" className="t1" data-aos="fade-left" data-aos-duration="1000" />
            <h1 data-aos="flip-down" data-aos-duration="1000">תשלום</h1>
            <img src={t2} alt="" className="t2" data-aos="fade-right" data-aos-duration="1000" />
          </div>

          <div className="pay" style={{ marginTop: "10px" }}>

            <Box
              component="form"
              sx={{
                marginTop: "2rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem",
                width: "50%",
                margin: "auto",
              }}
            >

              <TextField
                id="outlined-basic"
                label="שם מלא"
                variant="outlined"
                onChange={(e) => setFullName(e.target.value)}
                color="error"
                required
                error={vaildationError.fullName}
                helperText={vaildationError.fullName}
                sx={{ marginRight: { md: -25, xs: 0 }, width: 225 }}
              />

              <FormControl required={!city} disabled={!!city} style={{ marginRight: -200 }}>
                <InputLabel id="filter-label">בחירת סניף</InputLabel>
                <Select
                  labelId="branch-label"
                  id="branch"
                  label="בחירת סניף"
                  fullWidth
                  required
                  value={branch}
                  onChange={handleChangeBranch}
                  color="error"
                  sx={{ width: 225, marginRight: { md: 0, xs: 25 }, }}
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

              <FormControl sx={{ marginRight: { md: -25, xs: 0 } }}>
                <FormLabel id="demo-controlled-radio-buttons-group" sx={{ marginRight: 4, color: "white" }}>סוג איסוף</FormLabel>
                <RadioGroup
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={typeCollect}
                  onChange={handleChangeCollect}
                >
                  <FormControlLabel value="איסוף עצמי" control={<Radio />} label="איסוף עצמי" />
                  <br />
                  <FormControlLabel value="משלוח" control={<Radio />} label="משלוח" style={{ marginTop: -65, marginRight: 200 }} />
                </RadioGroup>
              </FormControl>

              {typeCollect === "משלוח" && (<div style={{ marginRight: 35, display: "flex" }}>
                <Grid container spacing={1} style={{ alignItems: "center", justifyContent: "center" }} >
                  <Grid item md={6} sm={8} xs={12}  >
                    <TextField
                      id="outlined-basic"
                      label="כתובת מלאה"
                      variant="outlined"
                      onChange={(e) => setStreet(e.target.value)}
                      color="error"

                      error={vaildationError.street}
                      helperText={vaildationError.street}
                    />
                  </Grid>
                  <Grid item md={6} sm={8} xs={12} >
                    <Autocomplete
                      id="grouped-demo"
                      className="city"
                      options={namesOfSettlements.sort((a, b) => -b.localeCompare(a))}
                      groupBy={(option) => option[0]} // מקבץ לפי האות הראשונה
                      getOptionLabel={(option) => option}
                      sx={{
                        width: { md: 223 }
                      }}
                      value={city}
                      onChange={handleChangeSettlement}
                      renderInput={(params) => <TextField {...params} label="עיר" />}
                    />
                  </Grid>
                </Grid>
              </div>
              )}

              <FormControl sx={{ marginRight: { md: -25, xs: 0 } }}>
                <FormLabel id="demo-controlled-radio-buttons-group" sx={{ marginRight: 4, color: "white" }}>סוג תשלום</FormLabel>
                <RadioGroup
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={typePay}
                  onChange={handleChangePay}
                >
                  <FormControlLabel value="מזומן" control={<Radio />} label="מזומן" />
                  <br />
                  <FormControlLabel value="אשראי" control={<Radio />} label="אשראי" style={{ marginTop: -65, marginRight: 200 }} />
                </RadioGroup>
              </FormControl>


              {typePay === "אשראי" && (
                <div style={{ marginRight: 35, display: "flex", maxWidth: 465 }}>
                  < Grid container spacing={1} style={{ alignItems: "center", justifyContent: "center", }} >
                    <Grid item lg={6} md={6} sm={12} xs={12} >
                      <TextField
                        id="outlined-basic"
                        label="שם בעל הכרטיס"
                        variant="outlined"
                        onChange={(e) => setCardHolder(e.target.value)}
                        color="error"
                        type="text"
                        error={vaildationError.cardHolder}
                        helperText={vaildationError.cardHolder}
                      />
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12} >
                      <TextField
                        id="outlined-basic"
                        label="סוג כרטיס"
                        variant="outlined"
                        onChange={(e) => setCardType(e.target.value)}
                        color="error"
                        type="text"
                        error={vaildationError.cardType}
                        helperText={vaildationError.cardType}
                      />
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}  >
                      <TextField
                        id="outlined-basic"
                        label="CVV"
                        variant="outlined"
                        onChange={(e) => setCardCvv(e.target.value)}
                        color="error"
                        type="number"
                        error={vaildationError.cardCvv}
                        helperText={vaildationError.cardCvv}
                      />
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <TextField
                        id="outlined-basic"
                        label="מספר כרטיס"
                        variant="outlined"
                        onChange={(e) => setCardNumber(e.target.value)}
                        color="error"
                        type="number"
                        error={vaildationError.cardNumber}
                        helperText={vaildationError.cardNumber}
                      />
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}  >
                      <TextField
                        id="outlined-basic"
                        label="תוקף הכרטיס - חודש"
                        variant="outlined"
                        onChange={(e) => setCardMonth(e.target.value)}
                        color="error"
                        type="number"
                        error={vaildationError.cardMonth}
                        helperText={vaildationError.cardMonth}
                      />
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <TextField
                        id="outlined-basic"
                        label="תוקף הכרטיס - שנה"
                        variant="outlined"
                        onChange={(e) => setCardYear(e.target.value)}
                        color="error"
                        type="number"
                        error={vaildationError.cardYear}
                        helperText={vaildationError.cardYear}
                      />
                    </Grid>
                  </Grid>
                </div>
              )}

              <TextField
                id="outlined-multiline-static"
                label="הערות על ההזמנה"
                multiline
                // rows={4}
                rows={isSmallScreen ? 2 : 4}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                sx={{ marginTop: 2, marginBottom: 2, marginRight: { md: 0, sm: 5, xs: 3 }, height: 100, width: { md: 400, sm: 250, xs: 250 } }}
                color="error"
              />

              <div style={{ textAlign: "center", marginTop: 50 }}>
                <h3 className="total-payment" style={{ color: "white", marginRight: -150 }}>סה"כ לתשלום : &nbsp;
                  <span style={{ color: "#C1121F", fontWeight: "bold" }}>{cart.totalAmount}</span>       ₪</h3>

                <Link to="/Pay" className="btn btn-shadow btn-pay" onClick={handleSubmit}
                  style={{ display: "flex", marginTop: -45, marginRight: 350 }}>
                  תשלום
                </Link>
              </div>
            </Box>
          </div >

          {success &&
            (<Alert severity="success" sx={{ margin: "0 auto", width: { md: 500, sm: 400, xs: 300 }, justifyContent: "center", marginTop: 5 }}
            >
              {success}
            </Alert>)
          }
          {
            error && (
              <Alert severity="error" sx={{ margin: "0 auto", width: { md: 500, sm: 400, xs: 300 }, justifyContent: "center", marginTop: 5 }}
              >
                {error}
              </Alert>
            )
          }
        </div>
      )}

      {paid && <Receipt ReceiptDetails={receiptDetails} />}

    </div >
  );
};

export default Pay;