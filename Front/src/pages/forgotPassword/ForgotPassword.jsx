import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Container, TextField, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Alert from "@mui/material/Alert";

import AOS from 'aos';

import t1 from "../../IMAGES/t1.png";
import t2 from "../../IMAGES/t2.png";

import "./ForgotPassword.css";

const ForgotPassword = () => {
    const apiUrl = process.env.REACT_APP_API_URL;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");

    const navigation = useNavigate();

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [vaildationError, setVaildationError] = useState({});

    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const Validate = () => {
        const error = {};
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Validate()) {
            const userData = {
                email: email,
                newPassword: password,
                phone: phone
            };
            try {
                const response = await axios.post(
                    `${apiUrl}/auth/forgot_password`,
                    // "http://localhost:3000/auth/forgot_password",
                    userData
                );

                if (response.status === 200) {
                    setError("");
                    setSuccess("הסיסמא שונתה בהצלחה");
                    setTimeout(() => {
                        navigation("/signIn");
                    }, 2000);
                }

            } catch (err) {
                setSuccess("");
                if (err.response.status === 400) {
                    setError("המשתמש לא קיים במערכת");
                }
                if (err.response.status === 405) {
                    setError("האימות נכשל, מספר הפלאפון לא תואם למספר השמור במערכת")
                }
                if (err.response.status === 500) {
                    setError("משהו השתבש, נסו שוב")
                }
                console.error(err);
            }
        }
    };

    useEffect(() => {
        AOS.init();
    }, []);

    return (
        <Container maxWidth="sm">
            <div className="forgot" style={{ minHeight: "100vh" }}>
                <div className="title-design">
                    <img src={t1} alt="" className="t1" data-aos="fade-left" data-aos-duration="1000" />
                    <h1 data-aos="flip-down" data-aos-duration="1000">שכחתי סיסמא</h1>
                    <img src={t2} alt="" className="t2" data-aos="fade-right" data-aos-duration="1000" />
                </div>

                <div style={{ marginTop: "10px" }}>
                    <div className="spacer">
                        <TextField
                            label="כתובת דוא''ל"
                            variant="outlined"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            data-aos="fade-right"
                            data-aos-duration="1000"
                            required
                            error={vaildationError.email}
                            helperText={vaildationError.email}
                            margin="normal"
                            color="error"
                        />
                    </div>
                    <div className="spacer">
                        <TextField
                            label="פלאפון"
                            type="number"
                            variant="outlined"
                            fullWidth
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            data-aos="fade-left"
                            data-aos-duration="1000"
                            required
                            error={vaildationError.phone}
                            helperText={vaildationError.phone}
                            margin="normal"
                            color="error"
                        />
                    </div>
                    <div className="spacer">
                        <TextField
                            label="סיסמא חדשה"
                            // type="password"
                            type={showPassword ? "text" : "password"} // Toggle password visibility
                            variant="outlined"
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            data-aos="fade-right"
                            data-aos-duration="1000"
                            required
                            error={vaildationError.password}
                            helperText={vaildationError.password}
                            margin="normal"
                            color="error"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={togglePasswordVisibility} edge="end" sx={{ left: 0 }}>
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>
                    <button
                        className="btn btn-shadow"
                        onClick={handleSubmit}
                        variant="contained"
                        color="primary"
                        fullWidth
                        size="large"
                        style={{ width: 200, fontSize: "x-large", marginTop: 40 }}
                    >
                        עדכון סיסמא
                    </button>
                </div>
            </div>
            {success && (
                <Alert severity="success" sx={{ margin: "0 auto", width: { md: 500, sm: 400, xs: 300 }, justifyContent: "center", marginBottom: 15, marginTop: -10 }}
                >
                    {success}
                </Alert>
            )}
            {error && (
                <Alert severity="error" sx={{ margin: "0 auto", width: { md: 500, sm: 400, xs: 300 }, justifyContent: "center", marginBottom: 15, marginTop: -10 }}
                >
                    {error}
                </Alert>
            )}
        </Container>
    );
};

export default ForgotPassword;