import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';

import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Container } from '@mui/material';

import "./Receipt.css";

const Receipt = ({ ReceiptDetails }) => {
    const navigation = useNavigate();
    const [phone, setPhone] = useState("");

    const branches = [
        { name: "אשדוד", phone: "08-8539797" },
        { name: "באר שבע", phone: "08-9922334" },
        { name: "רמת גן", phone: "077-7000333" },
        { name: "תל אביב", phone: "053-321-3626" },
        { name: "לוד", phone: "077-7000333" },
        { name: "ראש העין", phone: "077-7000333" },
        { name: "כפר סבא", phone: "077-7000333" },
        { name: "נתניה", phone: "09-893-2989" },
        { name: "עפולה", phone: "077-7000333" },
        { name: "קרית אתא", phone: "04-8535070" },
    ];

    const findPhoneByBranchName = (branchName) => {
        const branch = branches.find(branch => branch.name === branchName);
        return branch.phone;
    }

    useEffect(() => {
        setPhone(findPhoneByBranchName(ReceiptDetails.branch));
        window.scrollTo(0, 0);
    }, [ReceiptDetails])

    const printPDF = () => {
        const input = document.getElementById('pdf-content');

        const clonedContent = input.cloneNode(true);
      
        clonedContent.querySelector('#div-selector').parentNode.removeChild(clonedContent.querySelector('#div-selector'));
      
        const body = document.body;
        body.appendChild(clonedContent); 
        
        html2canvas(clonedContent)
            // html2canvas(input)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF();
                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                let pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

                // בדיקה האם גובה התמונה גדול מגובה העמוד
                if (pdfHeight > pdf.internal.pageSize.getHeight()) {
                    pdfHeight = pdf.internal.pageSize.getHeight(); // קביעת גובה התמונה לגובה העמוד
                }

                // חישוב המיקום המרכזי של התמונה
                const offsetX = (pdf.internal.pageSize.getWidth() - pdfWidth) / 2;
                const offsetY = (pdf.internal.pageSize.getHeight() - pdfHeight) / 2;

                // הוספת התמונה לקובץ PDF
                pdf.addImage(imgData, 'PNG', offsetX, offsetY, pdfWidth, pdfHeight);

                // pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save("receipt.pdf");
            });

            setTimeout(() => {
                navigation("/");
              }, 2000);
    };

    const [hovered, setHovered] = useState(false);

    return (
        <div className='receipt'>
            <Container
                id="pdf-content"
                maxWidth="sm"
                sx={{
                    marginTop: 20, background: "white", padding: 5, position: "relative",
                }}>

                <div className="div-selector" id="div-selector"
                    style={{
                        position: 'fixed',
                        left: '5px',
                    }}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    onClick={printPDF}>
                    <div className="selector-2">
                        {hovered && <span className='span-receipt'
                            style={{ position: "absolute", left: "-20px", width: 5, fontWeight: "bold", textDecoration: "underline" }}>לחצו להורדת הקבלה</span>}
                        <i className="fa fa-download" aria-hidden="true" ></i>
                    </div>
                </div>


                <Grid container spacing={2} textAlign="right" paddingRight={3} marginTop={5}>
                    <Grid item xs={5} sm={6} >
                        <strong>שם:</strong> {ReceiptDetails.fullName}
                    </Grid>
                    <Grid item xs={5} sm={6} >
                        <strong>תאריך:</strong> {ReceiptDetails.date}
                    </Grid>
                    <Grid item xs={5} sm={6} >
                        <strong>סניף:</strong> טריאקי {ReceiptDetails.branch}
                    </Grid>
                    <Grid item xs={7} sm={6} >
                        <strong>טלפון:</strong> {phone}
                    </Grid>
                </Grid>

                <h3 style={{ textAlign: "center", marginTop: 20, marginBottom: 20 }}>קבלה</h3>

                <TableContainer component={Paper}>
                    <Table sx={{ maxWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="right">מוצר</TableCell>
                                <TableCell component="th" scope="row">כמות</TableCell>
                                <TableCell component="th" scope="row">מחיר</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {ReceiptDetails.products.map((product, index) => (
                                <TableRow
                                    key={index}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell align="right" >
                                        {product.name}
                                    </TableCell>
                                    <TableCell >{product.quantity}</TableCell>
                                    <TableCell >{product.price * product.quantity} ₪</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <br />

                <div style={{ textAlign: 'left', paddingLeft: 3 }}>
                    <strong>סך הכל:</strong> {ReceiptDetails.totalPrice} ₪
                </div>

                {ReceiptDetails.comments && (
                    <div>
                        <hr style={{ borderTop: '1px solid #000' }} />

                        <div style={{ paddingRight: 30 }}>
                            <strong>הערות:</strong> {ReceiptDetails.comments}
                        </div>
                    </div>
                )}

                <hr style={{ borderTop: '1px solid #000' }} />

                <div style={{ paddingRight: 30 }}>
                    <strong>אופן האיסוף:</strong> {ReceiptDetails.typeCollect}
                    {ReceiptDetails.typeCollect === "משלוח" && (
                        <div style={{ marginTop: 8 }}>
                            <strong>כתובת:</strong> {ReceiptDetails.street}, {ReceiptDetails.city}
                        </div>
                    )}
                </div>

                <hr style={{ borderTop: '1px solid #000' }} />

                <div style={{ paddingRight: 30 }}>
                    <strong>אופן התשלום:</strong> {ReceiptDetails.typePay}
                    {ReceiptDetails.typePay === "אשראי" &&
                        <Grid container spacing={2} textAlign="right" style={{ marginTop: 3 }}>
                            <Grid item xs={12} sm={6} >
                                <strong>בעל הכרטיס:</strong> {ReceiptDetails.cardHolder}
                            </Grid>
                            <Grid item xs={12} sm={6} >
                                <strong>סוג כרטיס:</strong> {ReceiptDetails.cardType}
                            </Grid>
                            <Grid item xs={12} sm={6} >
                                <strong>מספר כרטיס:</strong> {ReceiptDetails.cardNumber}
                            </Grid>
                            <Grid item xs={12} sm={6} display={'flex'}>
                                <div><strong>CVV:&nbsp;</strong> </div>
                                <div>{ReceiptDetails.cardCvv}</div>
                            </Grid>
                            <Grid item xs={12} sm={6} >
                                <strong>תוקף הכרטיס:</strong> {ReceiptDetails.cardMonth}/{ReceiptDetails.cardYear}
                            </Grid>
                        </Grid>
                    }
                </div>

                <div style={{ textAlign: 'left', marginTop: 20, paddingLeft: 80 }}>
                    <h1> <strong> בתאבון! </strong> </h1>
                </div>

            </Container>
        </div>
    );
}

export default Receipt;