import {
  Button,
  DialogActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText
} from '@mui/material';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';

const NotAllowed = () => {

  const [open, setOpen] = useState(true);
  let navigate = useNavigate();

  const handleClose = () => {
      setOpen(false);
      navigate("/home");
  };
  
  return (
    <div> 
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Something went wrong"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Book a session to use
          </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button
                variant="contained"
                onClick={() => navigate("/home")}
            >
            Back to Homepage
            </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default NotAllowed
