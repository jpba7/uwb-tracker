import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import { getCSRFToken } from '../../utils';

const csrftoken = getCSRFToken('csrftoken');

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
      <DialogTitle>Redefinição senha</DialogTitle>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
      >
        <DialogContentText>
          Entre em contato com o administrador do sistema para iniciar o processo de redefinição de senha.
        </DialogContentText>
        
      </DialogContent>
    </Dialog>
  );
}

ForgotPassword.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default ForgotPassword;