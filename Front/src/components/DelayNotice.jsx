import React, { useState } from "react";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const DelayNotice = () => {
    const [show, setShow] = useState(true);

    return (
        <Dialog
            className="delay-notice-dialog"
            open={show}
            onClick={() => setShow(false)}
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
                    onClick={() => setShow(false)}

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
                    height: { xs: 180, sm: 120 },
                    width: { xs: 250, sm: 380 },
                    paddingTop: 7,
                    marginTop: 3,
                    paddingLeft: 5,
                    paddingRight: 5,
                    textAlign: 'center',
                }}
            >
                <h5>
                    האתר שלי רץ על שרת חינמי! 🚀
                    <br />
                    לפעמים זה לוקח דקה עד שהתפריט עולה, אבל שווה לחכות 😉
                </h5>

            </DialogContent>
            <DialogActions sx={{ justifyContent: "flex-end", paddingBottom: '20px', paddingLeft: '30px' }}>
                <button
                    onClick={() => setShow(false)}
                    className="btn" >
                    סגור
                </button>
            </DialogActions>
        </Dialog>
    );
};

export default DelayNotice;