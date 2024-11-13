import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { IconButton, InputAdornment, } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Alert from "@mui/material/Alert";

import AOS from 'aos';

import t1 from "../../IMAGES/t1.png";
import t2 from "../../IMAGES/t2.png";

import "./SignUp.css";

const SignUp = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const [phone, setPhone] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [vaildationError, setVaildationError] = useState({});

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const navigate = useNavigate();
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const Validate = () => {
    const error = {};
    if (!fullName) {
      error.fullName = "שדה חובה";
    } else if (!/^[א-תa-zA-Z]+( [א-תa-zA-Z]+)*$/.test(fullName)) {
      error.fullName = "אנא הכנס שם מלא תקני, ללא רווחים ריקים בתחילה או בסוף";
    }
    if (!email) {
      error.email = "שדה חובה";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      error.email = "כתובת הדוא''ל אינה תקינה";
    }
    if (!password) {
      error.password = "שדה חובה";
    } else if (password.length < 8) {
      error.password = "הסיסמא חייבת להיות באורך של 8 תווים לפחות";
    }
    if (!phone) {
      error.phone = "שדה חובה";
    } else if (phone.length !== 10) {
      error.phone = "מספר הפלאפון אינו תקין";
    }
    setVaildationError(error);
    return Object.keys(error).length === 0;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (Validate()) {
      const userData = {
        fullName: fullName,
        email: email,
        password: password,
        // date: newDate,
        // date: formattedDate
        phone: phone
      };

      try {
        const response = await axios.post(
          `${apiUrl}/auth/register`,
          // "http://localhost:3000/auth/register",
          userData,
          config
        );
        console.log(response.status);

        if (response.status === 200) {
          setError("");
          setSuccess("ההרשמה בוצעה בהצלחה");
          setTimeout(() => {
            navigate("/signIn");
          }, 2000);
        }
      } catch (error) {
        setSuccess("");
        if (error.response.status === 400) {
          setError("כתובת הדוא''ל כבר קיימת במערכת");
        }
        if (error.response.status === 500) {
          setError("משהו השתבש, נסו שוב")
        }
        console.error(error);
      }
    }
  };

  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <div className="harshama" style={{ minHeight: "100vh" }}>

      <div className="title-design">
        <img src={t1} alt="" className="t1" data-aos="fade-left" data-aos-duration="1000" />
        <h1 data-aos="flip-down" data-aos-duration="1000">הרשמה לאתר</h1>
        <img src={t2} alt="" className="t2" data-aos="fade-right" data-aos-duration="1000" />
      </div>
      <Box
        component="form"
        sx={{
          marginTop: "10px"
        }}
        noValidate
        autoComplete="off"
      >

        <TextField
          className="rGap"
          id="outlined-basic"
          label="שם מלא"
          variant="outlined"
          data-aos="fade-right"
          data-aos-duration="1000"
          required
          autoComplete="off"
          error={vaildationError.fullName}
          helperText={vaildationError.fullName}
          onChange={(e) => setFullName(e.target.value)}
          color="error"
        />

        <br />

        <TextField
          id="outlined-basic"
          type="number"
          label="פלאפון"
          variant="outlined"
          data-aos="fade-left"
          data-aos-duration="1000"
          required
          autoComplete="off"
          onChange={(e) => setPhone(e.target.value)}
          helperText={vaildationError.phone}
          error={vaildationError.phone}
          color="error"
        />

        <br />

        <TextField
          className="rGap"
          id="outlined-basic"
          label="כתובת דוא''ל"
          type={"email"}
          data-aos="fade-right"
          data-aos-duration="1000"
          required
          autoComplete="off"
          variant="outlined"
          onChange={(e) => setEmail(e.target.value)}
          error={vaildationError.email}
          helperText={vaildationError.email}
          color="error"
        />

        <br />

        <TextField
          id="outlined-basic"
          label="סיסמא"
          type={showPassword ? "text" : "password"} // Toggle password visibility
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          data-aos="fade-left"
          data-aos-duration="1000"
          required
          autoComplete="off"
          error={vaildationError.password}
          helperText={vaildationError.password}
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={togglePasswordVisibility} edge="end" sx={{ left: 0 }}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          color="error"
        />

        <br />

        <button
          className="btn btn-shadow"
          variant="contained" onClick={submitHandler}
          style={{ width: 150, fontSize: "x-large", marginTop: -15 }}>
          הרשמה
        </button>

        {success && (
          <Alert severity="success" sx={{ margin: "0 auto", width: { md: 500, sm: 400, xs: 300 }, justifyContent: "center" }}
          >
            {success}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ margin: "0 auto", width: { md: 500, sm: 400, xs: 300 }, justifyContent: "center" }} >
            {error}
          </Alert>
        )}
      </Box>

    </div>
  );
};

export default SignUp;