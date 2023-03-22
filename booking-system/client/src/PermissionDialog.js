import { React, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const DialogPopup = (props) => {
  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.handleClose}
      >
        <DialogTitle>
          {props.title}
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            {props.message}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={props.handleClose}>Got it!</Button>
        </DialogActions>

      </Dialog>
    </div>
  );
}

export default DialogPopup;
