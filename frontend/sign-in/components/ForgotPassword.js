import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import { getCookie } from '../../utils';

const csrftoken = getCookie('csrftoken');

function ForgotPassword({ open, handleClose }) {
  const passwordResetUrl = window.DJANGO_URLS.PASSWORD_RESET;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          component: 'form',
          action: passwordResetUrl,
          method: "POST",
          sx: { backgroundImage: 'none' },
        },
      }}
    >
      <DialogTitle>Resetar senha</DialogTitle>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
      >
        <DialogContentText>
          Insira o endereço de email vinculado a sua conta e enviaremos um link para redefinição da senha.
        </DialogContentText>
        
        <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken} />

        <OutlinedInput
          autoFocus
          required
          margin="dense"
          id="email"
          name="email"
          label="Endereço de Email"
          placeholder="Endereço de Email"
          type="email"
          fullWidth
        />
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" type="submit">
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ForgotPassword.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default ForgotPassword;