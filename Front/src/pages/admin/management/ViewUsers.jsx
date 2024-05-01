import React, { useEffect, useState } from "react";
import axios from "axios";

import { Container } from "@mui/system";
import { Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material";
// import { Table, TableHead, TableBody, TableRow, TableCell, Button } from "@mui/material";

import AOS from 'aos';

import t1 from "../../../IMAGES/t1.png";
import t2 from "../../../IMAGES/t2.png";

import "./ViewUsers.css";

// import ReactHTMLTableToExcel from 'react-html-table-to-excel'; 
import * as xlsx from 'xlsx';

const ViewUsers = () => {
    const [allUsers, setallUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:3000/auth/all");
            setallUsers(response?.data.users);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        AOS.init();

        fetchUsers();
    }, []);


    const exportToExcel = () => {
        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(allUsers);
        xlsx.utils.book_append_sheet(wb, ws, "Customers");
        const excelBuffer = xlsx.write(wb, { bookType: 'xlsx', type: 'array' });
        saveAsExcelFile(excelBuffer, "customers.xlsx");
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
        <div className="users">
            <div className="title-design">
                <img src={t1} alt="" className="t1" data-aos="fade-left" data-aos-duration="1000" />
                <h1 data-aos="flip-down" data-aos-duration="1000">מאגר לקוחות</h1>
                <img src={t2} alt="" className="t2" data-aos="fade-right" data-aos-duration="1000" />
            </div>

            <Container style={{maxWidth:600}}>
            <button variant="contained" className="btn" onClick={exportToExcel} style={{marginRight:380,marginBottom:"10px"}}>ייצוא ל-Excel</button>

                <Table className="table table-bordered" style={{ width: 500, marginTop: "10px" }} >

                    <TableHead>
                        <TableRow style={{ borderColor: "#C1121F" }}>
                            <TableCell style={{ textAlign: "center" }}> שם משתמש</TableCell>
                            {/* <TableCell style={{ textAlign: "center" }}> תאריך לידה</TableCell> */}
                            <TableCell style={{ textAlign: "center" }}> פלאפון</TableCell>
                            <TableCell style={{ textAlign: "center" }}>כתובת דוא''ל</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {allUsers ? (
                            allUsers.map((user) => (
                                <TableRow style={{ borderColor: "#C1121F", textAlign: "center" }}>
                                    <TableCell style={{ textAlign: "center" }}>{user.fullName}</TableCell> {/* Display userId */}
                                    {/* <TableCell style={{ textAlign: "center" }}>{user.date}</TableCell> Display User date */}
                                    <TableCell style={{ textAlign: "center" }}>0{user.phone}</TableCell> {/* Display User phone */}
                                    <TableCell style={{ textAlign: "center" }}>{user.email}</TableCell> {/* Display User email */}
                                </TableRow>
                            )))
                            :
                            (<h2>not found</h2>)}
                    </TableBody>
                </Table>
            </Container>
        </div>
    );
};

export default ViewUsers;